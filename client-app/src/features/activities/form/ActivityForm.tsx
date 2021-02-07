import React, { useContext, useEffect, useState } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { IActivityFormValues } from '../../../models/activity'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput'
import TextAreaInput from '../../../app/common/form/TextAreaInput'
import SelectInput from '../../../app/common/form/SelectInput'
import { category } from '../../../app/common/options/categoryOptions'
import { DateInput } from '../../../app/common/form/DateInput'
import { combineDateAndTime } from '../../../app/common/util/util'

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {

    const {
        submitting,
        activity: initialFormState,
        loadActivity,
        clearActivity
    } = useContext(ActivityStore);

    const [activity, setActivity] = useState<IActivityFormValues>({
        id: undefined,
        title: '',
        category: '',
        description: '',
        date: undefined,
        time: undefined,
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (match.params.id
            // Don't call when submitting for editting
            && activity.id) {
            loadActivity(match.params.id)
                .then(() => initialFormState && setActivity(initialFormState));
        }

        // When unmount this component, set Activity in the store to null.
        return () => {
            clearActivity();
        }

    }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id]); // Add in the dependencies otherwise this will run all the time. 
    // TIP:  adding an empty array will cause it to only run once

    // const handleSubmit = () => {

    //     if (activity.id.length === 0) {
    //         let newActivity = {
    //             ...activity,
    //             id: uuid()
    //         }
    //         createActivity(newActivity).then(() => {
    //             history.push(`/activities/${newActivity.id}`)
    //         });
    //     } else {
    //         editActivity(activity).then(() => {
    //             history.push(`/activities/${activity.id}`)
    //         });
    //     }
    // }

    const handleFinalFormSubmit = (values: any) => {

        const dateAndTime = combineDateAndTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        console.log(activity);
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit }) => (

                            <Form onSubmit={handleSubmit}>
                                <Field
                                    component={TextInput}
                                    name='title'
                                    placeholder='Title'
                                    value={activity.title}
                                />
                                <Field
                                    component={TextAreaInput}
                                    name='description'
                                    rows={3}
                                    placeholder='Description'
                                    value={activity.description}
                                />
                                <Field
                                    component={SelectInput}
                                    options={category}
                                    name='category'
                                    placeholder='Category'
                                    value={activity.category}
                                />
                                <Form.Group widths='equal'>
                                    <Field
                                        component={DateInput}
                                        name='date'
                                        date={null}
                                        placeholder='Date'
                                        value={activity.date}
                                    />
                                    <Field
                                        component={DateInput}
                                        name='time'
                                        date={null}
                                        placeholder='Time'
                                        value={activity.time}
                                    />
                                </Form.Group>

                                <Field
                                    component={TextInput}
                                    name='city' placeholder='City'
                                    value={activity.city}
                                />
                                <Field
                                    component={TextInput}
                                    name='venue'
                                    placeholder='Venue'
                                    value={activity.venue}
                                />
                                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                                <Button floated='right' type='button' content='Cancel' onClick={() => history.push('./activities')} />
                            </Form>
                        )
                        }
                    />
                </Segment>
            </Grid.Column>
        </Grid >

    )
}

export default observer(ActivityForm);