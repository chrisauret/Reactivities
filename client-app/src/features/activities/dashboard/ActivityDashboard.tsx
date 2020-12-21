import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useContext } from 'react'
import { Grid } from 'semantic-ui-react'
import { IActivity } from '../../../models/activity'
import ActivityDetails from '../details/ActivityDetails'
import { ActivityForm } from '../form/ActivityForm'
import ActivityList from './ActivityList'
import ActivityStore from '../../../app/stores/activityStore'

interface IProps {
    activities: IActivity[];
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
    submitting: boolean;
    target: string
}

const ActivityDashboard: React.FC<IProps> = (
    {
        activities,
        setEditMode,
        setSelectedActivity,
        editActivity,
        deleteActivity,
        submitting,
        target
    }) => {

    const { editMode, selectedActivity } = useContext(ActivityStore);

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList
                    activities={activities}
                    deleteActivity={deleteActivity}
                    submitting={submitting}
                    target={target}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode && (
                    <ActivityDetails
                        setEditMode={setEditMode}
                        setSelectedActivity={setSelectedActivity}
                    />
                )}
                {editMode && (
                    <ActivityForm
                        key={selectedActivity && selectedActivity.id || 0}
                        setEditMode={setEditMode}
                        activity={selectedActivity!}
                        editActivity={editActivity}
                        submitting={submitting}
                    />
                )}
            </Grid.Column>
        </Grid >
    );
};

export default observer(ActivityDashboard);