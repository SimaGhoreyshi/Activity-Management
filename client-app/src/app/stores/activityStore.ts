import { IActivity } from './../models/activity';
import { observable, action, computed, configure, runInAction, makeObservable } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from '../api/agent';

configure({ enforceActions: "always" });

class ActivityStore {
    activityRegistry = new Map();
    activities: IActivity[] = [];
    selectedActivity: IActivity | undefined = undefined;
    loadingInitial = false;
    editMode = false;
    submitting = false;
    target = "";

    constructor() {
        makeObservable(this, {
            activityRegistry: observable,
            selectedActivity: observable,
            loadingInitial: observable,
            submitting: observable,
            target: observable,
            activitiesByDate: computed,
            loadActivities: action,
            selectActivity: action,
            createActivity: action,
            cancleSelectedActivity: action,
            cancleFormOpen: action,
            openEditForm: action,
            deleteActivity: action,
            editActivity: action,
            openCreateForm: action,
        });
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split(".")[0];
                    this.activityRegistry.set(activity.id, activity);
                })
                this.loadingInitial = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            })
            console.log(error);
        }

    }
    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id)
        this.editMode = false;
    }

    createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;
            })
        }
        catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    cancleSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
    cancleFormOpen = () => {
        this.editMode = false;
    }
    openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;

    }

    deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {

                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = "";
            })
        } catch (error) {
            runInAction(() => {
                this.target = "";
                this.submitting = false;
            })
            console.log(error);
        }
    }
    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            })
        }
        catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            console.log(error);

        }
    }

    openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }
}

export default createContext(new ActivityStore())