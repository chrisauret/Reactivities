import React, { useState, useEffect, Fragment } from 'react';
import { Container, List } from 'semantic-ui-react'
import axios from 'axios';
import { IActivity } from '../../models/activity';
import NavBar from '../../features/navbar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(x => x.id === id)[0]);
  }

  useEffect(() => {
    axios.get<IActivity[]>('https://localhost:5001/api/activities').then(response => {
      setActivities(response.data);
    });
  }, []);

  return (
    <Fragment>

      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <List>
          <ActivityDashboard
            activities={activities}
            selectActivity={handleSelectActivity}
            selectedActivity={selectedActivity} />
        </List>
      </Container>

    </Fragment>
  );

}

export default App;
