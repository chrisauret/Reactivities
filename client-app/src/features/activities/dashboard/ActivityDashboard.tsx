import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { Grid, Loader } from 'semantic-ui-react'
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import ActivityList from './ActivityList'
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';

const ActivityDashboard: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadActivities, loadingInitial, setPage, page, totalPages } = rootStore.activityStore;
    const [loadingNext, setLoadingNext] = useState(false); //565

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
                <InfiniteScroll //566
                    pageStart={0}
                    loadMore={handleGetNext}
                    hasMore={!loadingNext && page + 1 < totalPages}
                    initialLoad={false}
                >
                    <ActivityList />
                </InfiniteScroll>
                {/* <Button
                    floated='right'
                    content='more'
                    positive
                    disabled={totalPages === page + 1}
                    onClick={handleGetNext}
                    loading={loadingNext}
                /> */}
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid >
    );
};

export default observer(ActivityDashboard);