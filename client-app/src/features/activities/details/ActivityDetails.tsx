import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import { LoadingComponent } from '../../../app/layout/LoadingComponent'
import ActivityDetailesHeader from './ActivityDetailesHeader'
import { ActivityDetailesSidebar } from './ActivityDetailesSidebar'
import { ActivityDetailsChat } from './ActivityDetailsChat'
import { ActivityDetailsInfo } from './ActivityDetailsInfo'


interface DatailParams {
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DatailParams>> = ({ match, history }) => {

    const { activity, loadActivity, loadingInitial } = useContext(ActivityStore);

    useEffect(() => {
        loadActivity(match.params.id)
    }, [loadActivity, match.params.id]);
    // If you leave this off -',[loadActivity]', then it will run every time the component re-renders. Which is not what I want. I only want it to run once when the componentn mounts.

    if (loadingInitial || !activity) return <LoadingComponent content='Loading activity...' />

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailesHeader activity={activity} />
                <ActivityDetailsInfo activity={activity} />
                <ActivityDetailsChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailesSidebar />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDetails);