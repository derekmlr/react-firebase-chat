import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

import firebase from '../../config/firebase';

class Messages extends React.Component {
	state = {
		messagesRef: firebase.database().ref('messages'),
		channel: this.props.currentChannel
	}

	render() {
		const { messagesRef, channel } = this.state;

		return (
			<React.Fragment>
				<MessagesHeader />
				<Segment>
					<Comment.Group className="messages">
						{/* Messages */}
					</Comment.Group>
				</Segment>

				<MessageForm 
					channel={channel}
					messagesRef={messagesRef} 
				/>
			</React.Fragment>
		)
	}
}

export default Messages;