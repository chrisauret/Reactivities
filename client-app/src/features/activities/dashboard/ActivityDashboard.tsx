import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { Button, Grid } from 'semantic-ui-react'
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import ActivityList from './ActivityList'
import { RootStoreContext } from '../../../app/stores/rootStore';

const ActivityDashboard: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadActivities, loadingInitial, setPage, page, totalPages } = rootStore.activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPage(page + 1);
        loadActivities().then(() => setLoadingNext(false))
    }

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    if (loadingInitial && page === 0) return <LoadingComponent content='Loading Activities...' />

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
                <Button
                    floated='right'
                    content='more'
                    positive
                    disabled={totalPages === page + 1}
                    onClick={handleGetNext}
                    loading={loadingNext}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid >
    );
};

export default observer(ActivityDashboard);

function useSate(arg0: boolean): [any, any] {
    throw new Error('Function not implemented.');
}
