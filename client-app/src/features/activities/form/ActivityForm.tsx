import React, { FormEvent, useContext, useState } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../models/activity'
import ActivityStore from '../../../app/stores/activityStore'
import { v4 as uuid } from 'uuid'

interface IProps {
    setEditMode: (editMode: boolean) => void;
    activity: IActivity;
    editActivity: (activity: IActivity) => void;
    submitting: boolean;
}

export const ActivityForm: React.FC<IProps> = ({
    setEditMode,
    activity: initialFormState,
    editActivity,
    submitting
}) => {

    const { createActivity } = useContext(ActivityStore);

    const initializeForm = () => {
        if (initialFormState) {
            return initialFormState;
        }

        return {
            id: '',
            title: '',
            category: '',
            description: '',
            date: '',
            city: '',
            venue: ''
        };
    }

    const [activity, setActivity] = useState<IActivity>(initializeForm);

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
                <Button floated='right' type='button' content='Cancel' onClick={() => setEditMode(false)} />
            </Form>
        </Segment>
    )
}
