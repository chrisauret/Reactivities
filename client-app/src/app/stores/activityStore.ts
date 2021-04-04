import { SyntheticEvent } from 'react';
import { action, makeObservable, runInAction, computed, observable } from 'mobx';
import { IActivity } from '../../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createAttendee, setActivityProps } from '../common/util/util';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export default class ActivityStore {

    rootStore: RootStore

    activityRegistry = new Map();
    activity: IActivity | null = null;
    loadingInitial = false;
    loading = false;
    submitting = false;
    target: string = '';
    hubConnection: HubConnection | null = null; //541

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            activityRegistry: observable,
            activity: observable,
            loadingInitial: observable,
            loading: observable,
            submitting: observable,
            target: observable,
            activitiesByDate: computed,
            editActivity: observable,
            loadActivities: action,
            createActivity: action,
            deleteActivity: action,
            openCreateForm: action,
            clearActivity: action,
            attendActivity: action,
            cancelAttendance: action
        });

        this.rootStore = rootStore;
    }

    createHubConnection = () => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/chat', {
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Warning)
            .build();

        this.hubConnection
            .start()
            .then(() => console.log(this.hubConnection!.state))
            .catch((error) => console.log('Error establishing connection: ', error));

        this.hubConnection.on("ReceiveComment", comment => {
            runInAction(() => {
                this.activity!.comments.push(comment);
            })
        })
    };

    stopHubConnection = () => {
        this.hubConnection!.stop();
    }

    addComment = async (values: any) => {
        values.activityId = this.activity!.id

        try {
            await this.hubConnection!.invoke("SendComment", values);
        } catch (error) {
            console.log(error);
        }
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
            toast.error(error);
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
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = []; //544
            activity.isHost = true;
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

    attendActivity = async () => { //498
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })

        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem signing up to activity')
        }
    }

    cancelAttendance = async () => { //498
        this.loading = true;
        try {
            await agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(
                        x => x.username !== this.rootStore.userStore.user!.username
                    );
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                }
                this.loading = false;
            });
        }
        catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem cancelling attendance')
        }


    }
}