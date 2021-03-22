import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { IPhoto, IProfile } from "../../models/profile";
import agent from "../api/agent";
import { RootStore } from "./rootStore";

export default class ProfileStore {
    rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        makeAutoObservable(this);
    }

    profile: IProfile | null = null;
    loadingProfile = true;
    uploadingPhoto = false;
    loading = false;

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
            console.log('Uploading photo start');
            const photo = await agent.Profiles.uploadPhoto(file);

            console.log('Uploading photo finish');

            runInAction(() => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            })
        } catch (error) {
            console.log(error);
            toast.error('Probelm uploading file');
            runInAction(() => {
                this.uploadingPhoto = true;
            })
        }
    }

    setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(x => x.isMain)!.isMain = false;
                this.profile!.photos.find(x => x.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem setting photo as main');
            runInAction(() => {
                this.loading = true;
            })
        }
    }
}