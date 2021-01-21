import React, { useContext, useEffect } from 'react'
import { Button, Card, Image } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { Link, RouteComponentProps } from 'react-router-dom'
import { LoadingComponent } from '../../../app/layout/LoadingComponent'


interface DatailParams {
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DatailParams>> = ({ match, history }) => {

    const { activity, openEditForm, cancelSelectedActivity, loadActivity, loadingInitial } = useContext(ActivityStore);

    useEffect(() => {
        loadActivity(match.params.id)
    }, [loadActivity]);
    // If you leave this off -',[loadActivity]', then it will run every time the component re-renders. Which is not what I want. I only want it to run once when the componentn mounts.

    if (loadingInitial || !activity) return <LoadingComponent content='Loading activity...' />

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity!.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{activity!.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity!.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button
                        as={Link} to={`/manage/${activity.id}`}
                        basic
                        color='blue'
                        content='Edit'
                        onClick={() => openEditForm(activity!.id)}
                    />
                    <Button
                        basic
                        color='grey'
                        content='Cancel'
                        onClick={() => history.push('/activities')}
                    />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default observer(ActivityDetails);