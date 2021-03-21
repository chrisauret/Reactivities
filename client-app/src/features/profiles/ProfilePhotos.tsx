import { useContext, useState } from 'react'
import { Card, Header, Tab, Image, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const ProfilePhotos = () => { //520

    const rootStore = useContext(RootStoreContext);
    const { profile, isCurrentUser } = rootStore.profileStore;

    const [addPhotoMode, setAddPhotoMode] = useState(false);

    console.log({ profile });

    return (
        <Tab.Pane>
            <Header icon='image' content='Photos' />
            {isCurrentUser &&
                <Button floated='right' basic content={addPhotoMode ? 'Cancel' : 'Add Photo'} />
            }
            <Card.Group itemsPerRow={5} >
                {profile && profile.photos.map((photo) => (
                    < Card key={photo.id} >
                        <Image src={photo.url} />
                    </Card>
                ))}
            </Card.Group>

        </Tab.Pane >
    )
}

export default ProfilePhotos;