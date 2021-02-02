import { createContext, SyntheticEvent } from 'react';
import { action, configure, makeObservable, runInAction, computed, observable } from 'mobx';
import { IActivity } from '../../models/activity';
import Activities from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {

    activityRegistry = new Map();
    activity: IActivity | null = null;
    loadingInitial = false;
    submitting = false;
    target: string = '';

    constructor() {
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
    }

    get activitiesByDate() {

        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        )

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split('T')[0];

            activities[date] = activities[date] ? [...activities[date], activity] : [activity];

            return activities;

        }, {} as { [key: string]: IActivity[] })); // 111
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split('.')[0];
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
            this.activity = activity;
        } else {
            this.loadingInitial = true;

            try {

                activity = await Activities.details(id);
                runInAction(() => {
                    this.activity = activity;
                    this.loadingInitial = false;
                })

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
            await Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });

            console.log(error);
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
            await Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.submitting = false;
            });
        }
    }

    deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await await Activities.delete(id);
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

export default createContext(new ActivityStore());