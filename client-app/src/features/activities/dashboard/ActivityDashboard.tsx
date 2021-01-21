import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityDetails from '../details/ActivityDetails'
import ActivityForm from '../form/ActivityForm'
import ActivityList from './ActivityList'
import ActivityStore from '../../../app/stores/activityStore'

const ActivityDashboard = () => {

    const { editMode, activity } = useContext(ActivityStore);

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid >
    );
};

export default observer(ActivityDashboard);