import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
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
            isCurrentUser: computed,
            uploadPhoto: action,
            uploadingPhoto: observable
        });
    }

    profile: IProfile | null = null;
    loadingProfile = true;
    uploadingPhoto = false;

    get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        }
        return false;
    }

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

    uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
            })
        } catch (error) {
            console.log(error);
            toast.error('Probelm uploading file');
            runInAction(() => {
                this.uploadingPhoto = true;
            })
        }
    }
}