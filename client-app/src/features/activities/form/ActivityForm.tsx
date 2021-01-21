import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../models/activity'
import ActivityStore from '../../../app/stores/activityStore'
import { v4 as uuid } from 'uuid'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'


interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match }) => {

    const {
        createActivity,
        editActivity,
        submitting,
        cancelFormOpen,
        activity: initialFormState,
        loadActivity,
        clearActivity
    } = useContext(ActivityStore);

    useEffect(() => {
        if (match.params.id) {
            loadActivity(match.params.id)
                .then(() => initialFormState && setActivity(initialFormState));
        }

        // When unmount this component, set Activity in the store to null.
        return () => {
            clearActivity();
        }

    }, [loadActivity, clearActivity, match.params.id, initialFormState]); // Add in the dependencies otherwise this will run all the time. 
    // TIP:  adding an empty array will cause it to only run once

    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    const handleSubmit = () => {

        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value });
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name='title' placeholder='Title' value={activity.title} />
                <Form.TextArea onChange={handleInputChange} rows={2} name='description' placeholder='Description' value={activity.description} />
                <Form.Input onChange={handleInputChange} name='category' placeholder='Category' value={activity.category} />
                <Form.Input onChange={handleInputChange} type={'datetime-local'} name='date' placeholder='Date' value={activity.date} />
                <Form.Input onChange={handleInputChange} name='city' placeholder='City' value={activity.city} />
                <Form.Input onChange={handleInputChange} name='venue' placeholder='Venue' value={activity.venue} />
                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button floated='right' type='button' content='Cancel' onClick={cancelFormOpen} />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);