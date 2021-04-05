import { makeAutoObservable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import { IPhoto, IProfile } from "../../models/profile";
import agent from "../api/agent";
import { RootStore } from "./rootStore";

export default class ProfileStore {
    rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    this.followings = [];
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )

        makeAutoObservable(this);
    }

    profile: IProfile | null = null;
    loadingProfile = true;
    uploadingPhoto = false;
    loading = false;
    followings: IProfile[] = [];
    activeTab: number = 0;

    get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        }
        return false;
    }

    setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
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

    deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(x => x.id !== photo.id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem deleting photo');
            runInAction(() => {
                this.loading = true;
            })
        }
    }

    updateProfile = async (profile: Partial<IProfile>) => {
        try {
            await agent.Profiles.update(profile);
            runInAction(() => {
                if (profile.displayName !== this.rootStore.userStore.user!.displayName) {
                    this.rootStore.userStore.user!.displayName = profile.displayName!;
                }
                this.profile = { ...this.profile!, ...profile };
            })
        } catch (error) {
            console.log(error);
            toast.error('problem editing profile')
        }
    }

    follow = async (username: string) => { //557
        this.loading = true;

        try {
            await agent.Profiles.follow(username);
            runInAction(() => {
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem following user');
            runInAction(() => {
                this.loading = true;
            })
        }
    }

    unfollow = async (username: string) => { // 557
        this.loading = true;

        try {
            await agent.Profiles.unfollow(username);
            runInAction(() => {
                this.profile!.following = false;
                this.profile!.followersCount--;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem unfollowing user');
            runInAction(() => {
                this.loading = true;
            })
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loading = true;
        try {
            const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = profiles;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem loading  followings');
            runInAction(() => {
                this.loading = true;
            })
        }
    }


}