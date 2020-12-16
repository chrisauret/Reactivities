import React from 'react';
import { Header, Icon } from 'semantic-ui-react'
import './App.css';

function App() {
  return (
    <div>

      <Header as='h2'>
        <Icon name='plug' />
        <Header.Content>Reactivities</Header.Content>
      </Header>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
        </a>

    </div>
  );
}

export default App;
