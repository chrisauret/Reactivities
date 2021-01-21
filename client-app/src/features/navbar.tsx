import { observer } from 'mobx-react-lite';
import React from 'react'
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

const NavBar = () => {

    return (
        <div>
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item
                        header as={NavLink} to='/' exact>
                        <img src='/assets/logo.png' alt='logo' style={{ marginRight: '10px' }} />
                    </Menu.Item>

                    <Menu.Item
                        as={NavLink} to='/activities'
                        name='Activities'
                    />
                    <Menu.Item>
                        <Button
                            as={NavLink} to='/createActivity'
                            positive
                            content='Create Activity'
                        />
                    </Menu.Item>
                </Container>
            </Menu>
        </div>
    )
}

export default observer(NavBar);