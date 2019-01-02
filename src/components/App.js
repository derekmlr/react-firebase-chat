import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import ServersPanel from './ServersPanel/ServersPanel';
import RoomsPanel from './RoomsPanel/RoomsPanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

import './App.css';

/**
 * App Component
 * 
 * @param {Object} props 
 */
const App = ({ currentUser, currentChannel, isPrivateChannel, channelUsersPostCounts }) => (
  <Grid columns="equal" className="App">
    <ServersPanel />
    <RoomsPanel
      /*key={currentUser && currentUser.uid}*/
      currentUser={currentUser} 
    />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages 
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel} 
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
      />
    </Grid.Column>

    <Grid.Column width="4">
      <MetaPanel 
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        channelUsersPostCounts={channelUsersPostCounts}
      />
    </Grid.Column>
  </Grid>
)

/**
 * Map Redux global state items to App component's props
 * 
 * @param {Object} state 
 */
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  channelUsersPostCounts: state.channel.channelUsersPostCounts
});

export default connect(mapStateToProps)(App);