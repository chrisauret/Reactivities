import { makeAutoObservable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    modal = {
        open: false,
        body: null
    }

    // content will be the components
    openModal = (content: any) => {
        this.modal.open = true;
        this.modal.body = content;
    }

    closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }
}