import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import ServersPanel from './ServersPanel/ServersPanel';
import RoomsPanel from './RoomsPanel/RoomsPanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

import './App.css';

const App = ({ currentUser }) => (
  <Grid columns="equal" className="App">
    <ServersPanel />
    <RoomsPanel currentUser={currentUser} />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages />
    </Grid.Column>

    <Grid.Column width="3">
      <MetaPanel />
    </Grid.Column>
  </Grid>
)

const mapStateToProps = (state) => {
	return {
		currentUser: state.user.currentUser
	}
}

export default connect(mapStateToProps)(App);
