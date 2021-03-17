import { SyntheticEvent } from 'react';
import { action, makeObservable, runInAction, computed, observable } from 'mobx';
import { IActivity } from '../../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setActivityProps } from '../common/util/util';

export default class ActivityStore {

    rootStore: RootStore

    activityRegistry = new Map();
    activity: IActivity | null = null;
    loadingInitial = false;
    submitting = false;
    target: string = '';

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            activityRegistry: observable,
            activity: observable,
            loadingInitial: observable,
            submitting: observable,
            target: observable,
            activitiesByDate: computed,
            editActivity: observable,
            loadActivities: action,
            createActivity: action,
            deleteActivity: action,
            openCreateForm: action,
            clearActivity: action
        });

        this.rootStore = rootStore;
    }

    get activitiesByDate() {

        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        )

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];

            activities[date] = activities[date] ? [...activities[date], activity] : [activity];

            return activities;

        }, {} as { [key: string]: IActivity[] })); // 111
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });
            console.log(this.groupActivitiesByDate(activities));

        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            });
            console.log(error);

        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity
            return activity;
        } else {
            this.loadingInitial = true;

            try {

                activity = await agent.Activities.details(id);
                runInAction(() => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                });
                return activity;

            } catch (error) {

                runInAction(() => {
                    this.loadingInitial = false;
                })
                console.log(error);
            }
        }
    }

    clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error.response);
        }
    }

    openCreateForm = () => {
        runInAction(() => {
            this.activity = null;
        });
    }

    openEditForm = (id: string) => {
        this.activity = this.activityRegistry.get(id);
    }


    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error.response);
        }
    }

    deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.target = '';
                this.submitting = false;
            });
        }
    }
}