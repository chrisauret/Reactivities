import { configure } from 'mobx';
import { createContext } from 'react';
import ActivityStore from './activityStore'
import UserStore from './userStore'

configure({ enforceActions: 'always' });

export class RootStore {

    constructor() {

        this.activityStore = new ActivityStore(this); //466
        this.userStore = new UserStore(this);
    }

    activityStore: ActivityStore;
    userStore: UserStore
}

export const RootStoreContext = createContext(new RootStore());