import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Button, Container, Menu } from 'semantic-ui-react';
import ActivityStore from '../app/stores/activityStore'


const NavBar = () => {

    const activityStore = useContext(ActivityStore);

    return (
        <div>
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item header>
                        <img src='/assets/logo.png' alt='logo' style={{ marginRight: '10px' }} />
                    </Menu.Item>

                    <Menu.Item
                        name='Activities'
                    />
                    <Menu.Item>
                        <Button positive content='Create Activity' onClick={activityStore.openCreateForm} />
                    </Menu.Item>
                </Container>
            </Menu>
        </div>
    )
}

export default observer(NavBar);