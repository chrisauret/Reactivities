import { createContext, SyntheticEvent } from 'react';
import { action, configure, makeObservable, runInAction, computed, observable } from 'mobx';
import { IActivity } from '../../models/activity';
import Activities from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {

    activityRegistry = new Map();
    activities: IActivity[] = [];
    activity: IActivity | null = null;
    loadingInitial = false;
    editMode = false;
    submitting = false;
    target: string = '';

    constructor() {
        makeObservable(this, {
            activityRegistry: observable,
            activities: observable,
            activity: observable,
            loadingInitial: observable,
            editMode: observable,
            submitting: observable,
            target: observable,
            activitiesByDate: computed,
            editActivity: observable,
            loadActivities: action,
            createActivity: action,
            deleteActivity: action,
            openCreateForm: action,
            cancelSelectedActivity: action,
            cancelFormOpen: action,
            selectActivity: action,
            clearActivity: action
        });
    }

    get activitiesByDate() {

        console.log("Getting records: ", this.activityRegistry.values());

        return Array.from(this.activityRegistry.values())
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await Activities.list();
            runInAction(() => {

                console.log(activities);

                activities.forEach((activity) => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });

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
                this.editMode = false;
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
            this.editMode = true;
            this.activity = null;
        });
    }

    openEditForm = (id: string) => {
        this.activity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    cancelSelectedActivity = () => {
        this.activity = null;
    }

    cancelFormOpen = () => {
        this.editMode = false;
    }


    selectActivity = (id: string) => {
        this.activity = this.activityRegistry.get(id);
        this.editMode = false;
    }

    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.editMode = false;
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