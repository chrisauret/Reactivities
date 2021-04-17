import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../../models/user";
import agent from "../api/agent";
import { RootStore } from './rootStore';
import { history } from '../..';

export default class UserStre {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            user: observable,
            isLoggedIn: computed,
            login: action,
            register: action,
        });

        this.rootStore = rootStore;
    }

    user: IUser | null = null;

    get isLoggedIn() { return !!this.user }

    login = async (values: IUserFormValues) => {

        try {
            const user = await agent.User.login(values);

            // NB! Whenever setting an observable, it must be done inside of an action!
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');

        } catch (error) {
            throw error;
        }
    }

    register = async (values: IUserFormValues) => {

        try {
            const user = await agent.User.register(values);

            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');

        } catch (error) {
            throw error;
        }
    }


    getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            //this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    };

    logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }
}