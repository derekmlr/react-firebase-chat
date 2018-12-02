import React from 'react';
import { Segment, Comment, Loader } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

import firebase from '../../config/firebase';

class Messages extends React.Component {
	state = {
		messagesRef: firebase.database().ref('messages'),
		channel: this.props.currentChannel,
		user: this.props.currentUser,
		messagesLoading: true,
		messages:[]
	}

	componentDidMount() {
		const { channel, user } = this.state;

		if (channel && user) {
			this.addListeners(channel.id)
		}
	}
	
	addListeners = (channelId) => {
		this.addMessageListener(channelId);
	}

	/**
	 * Loads and listens for messages
	 */
	addMessageListener = (channelId) => {
		let loadedMessages = [];
		this.state.messagesRef
			.child(channelId)
			.on('child_added', (snap) => {
				loadedMessages.push(snap.val());
				this.setState({
					messages: loadedMessages,
					messagesLoading: false
				})
			});
	}

	/**
	 * Visually display messages
	 */
	displayMessages = (messages) => (
		messages.length > 0 && messages.map((message) => (
			<Message 
				key={message.timestamp}
				message={message} 
				user={this.state.user}
			/>
		))
	)

	render() {
		const { messagesRef, channel, user, messages, messagesLoading } = this.state;

		return (
			<React.Fragment>
				<MessagesHeader channel={channel} />
				<Segment className="messages">
					{messagesLoading ? (
						<Loader active style={{ marginTop: '2em' }} inline='centered' />
					) : (
						<Comment.Group>
							{this.displayMessages(messages)}
						</Comment.Group>
					)}
				</Segment>

				<MessageForm 
					channel={channel}
					messagesRef={messagesRef} 
					currentUser={user}
				/>
			</React.Fragment>
		)
	}
}

export default Messages;