import React, { useContext, useState } from 'react'
import { Button, Grid, Header, Tab } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { ProfileEditForm } from './ProfileEditForm';

export const ProfileDescription = () => {

    const [editMode, setEditMode] = useState(false);

    const rootStore = useContext(RootStoreContext);
    const {
        profile,
        updateProfile,
        isCurrentUser
    } = rootStore.profileStore;

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ paddingBottom: 0 }}>
                    <Header floated='left' icon='user' content={`About ${profile?.displayName}`} />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setEditMode(!editMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>

                    {editMode ? (
                        <ProfileEditForm
                            profile={profile!}
                            updateProfile={updateProfile}
                        />

                    ) : (
                        <span>{profile!.bio}</span>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}