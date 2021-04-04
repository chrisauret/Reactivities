import React from 'react'
import { Form as FinalForm, Field } from 'react-final-form';
import { Segment, Form, Button } from 'semantic-ui-react'
import TextAreaInput from '../../app/common/form/TextAreaInput'
import TextInput from '../../app/common/form/TextInput'
import { combineValidators, isRequired } from 'revalidate'
import { IProfile } from '../../models/profile';

interface IProps {
    profile: IProfile
    updateProfile: (profile: IProfile) => void;
}

const validate = combineValidators({
    displayName: isRequired('displayName')
})

export const ProfileEditForm: React.FC<IProps> = ({ profile, updateProfile }) => {

    return (
        <Segment clearing>
            <FinalForm
                onSubmit={updateProfile}
                validate={validate}
                initialValues={profile!}
                render={({ handleSubmit, invalid, pristine, submitting }) => (

                    <Form onSubmit={handleSubmit} error>
                        <Field
                            name='displayName'
                            component={TextInput}
                            placeholder='Display Name'
                            value={profile!.displayName}
                        />
                        <Field
                            name='bio'
                            component={TextAreaInput}
                            rows={3}
                            placeholder='Bio'
                            value={profile!.bio}
                        />

                        <Button
                            loading={submitting}
                            floated='right'
                            positive type='submit'
                            content='Update Profile'
                            disabled={invalid || pristine}
                        />
                    </Form>
                )
                }
            />
        </Segment>
    )
}
