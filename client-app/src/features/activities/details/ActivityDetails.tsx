import React, { useContext } from 'react'
import { Button, Card, Image } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'

const ActivityDetails = () => {

    const { selectedActivity: activity, openEditForm, cancelSelectedActivity } = useContext(ActivityStore);

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
                    <Button basic color='blue' content='Edit' onClick={() => openEditForm(activity!.id)} />
                    <Button basic color='grey' content='Cancel' onClick={cancelSelectedActivity} />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default observer(ActivityDetails);