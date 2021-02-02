import React from 'react'
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react'

export const HomePage = () => {
    return (
        <Container>
            <h1 style={{ marginTop: '7em' }}>Home Page</h1>
            <h3> Go to <Link to='/activities'>Activities</Link></h3>
        </Container>
    )
};