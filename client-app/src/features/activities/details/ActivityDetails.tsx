import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import { LoadingComponent } from '../../../app/layout/LoadingComponent'
import ActivityDetailesHeader from './ActivityDetailesHeader'
import { ActivityDetailesSidebar } from './ActivityDetailesSidebar'
import { ActivityDetailsChat } from './ActivityDetailsChat'
import { ActivityDetailsInfo } from './ActivityDetailsInfo'
import { RootStoreContext } from '../../../app/stores/rootStore'

interface DatailParams {
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DatailParams>> = ({ match, history }) => {

    const rootStore = useContext(RootStoreContext);
    const { activity, loadActivity, loadingInitial } = rootStore.activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id, history]);
    // If you leave this off -',[loadActivity][,..]', then it will run every time the component re-renders. Which is not what I want. I only want it to run once when the componentn mounts.

    if (loadingInitial)
        return <LoadingComponent content='Loading activity...' />

    if (!activity)
        return <h2>Activity  not found</h2>

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