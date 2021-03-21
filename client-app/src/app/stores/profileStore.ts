import { action, makeObservable, observable, runInAction } from "mobx";
import { IProfile } from "../../models/profile";
import agent from "../api/agent";
import { RootStore } from "./rootStore";

export default class ProfileStore {
    rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        makeObservable(this, {
            profile: observable,
            loadingProfile: observable,
            loadProfile: action,
        });
    }

    profile: IProfile | null = null;
    loadingProfile = true;

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingProfile = false;
                console.log(error);
            })
        }
    }
}