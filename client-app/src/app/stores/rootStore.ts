import { configure } from 'mobx';
import { createContext } from 'react';
import ActivityStore from './activityStore'
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import UserStore from './userStore'

configure({ enforceActions: 'always' });

export class RootStore {

    constructor() {

        this.activityStore = new ActivityStore(this); //466
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
    }

    activityStore: ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;//471
    modalStore: ModalStore;
}

export const RootStoreContext = createContext(new RootStore());