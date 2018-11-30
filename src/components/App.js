import React from 'react';
import { Grid } from 'semantic-ui-react';

import ServersPanel from './ServersPanel/ServersPanel';
import RoomsPanel from './RoomsPanel/RoomsPanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

import './App.css';

const App = () => (
  <Grid columns="equal" className="App">

    <Grid.Column width="3">
      <ServersPanel />
      <RoomsPanel />
    </Grid.Column>

    <Grid.Column>
      <Messages />
    </Grid.Column>

    <Grid.Column width="4">
      <MetaPanel />
    </Grid.Column>
  </Grid>
)

export default App;
