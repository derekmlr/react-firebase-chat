import React from 'react';
import { connect } from 'react-redux';
import { Segment, Comment, Loader, Message as MessageUI } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

import { setChannelUsersPostCounts } from '../../actions';

import firebase from '../../config/firebase';

class Messages extends React.Component {
	loadingTimeout = null;

	state = {
		messagesRef: firebase.database().ref('messages'),
		privateMessagesRef: firebase.database().ref('privateMessages'),
		channel: this.props.currentChannel,
		isPrivateChannel: this.props.isPrivateChannel,
		isChannelStarred: false,
		user: this.props.currentUser,
		usersRef: firebase.database().ref('users'),
		messagesLoading: true,
		messages:[],
		noMessages: false,
		userCount: 0,
		searchTerm: '',
		searchLoading: false,
		searchResults: []
	}

	componentDidMount() {
		const { channel, user } = this.state;

		if (channel && user) {
			this.addListeners(channel.id, user.uid);
		}

		// If messages don't load after 1 second, assume no messages
		this.loadingTimeout =	setTimeout(() => {
			if (this.state.messages && this.state.messages.length === 0) {
				this.setState({ noMessages: true });
			}
			this.setState({ messagesLoading: false });
		}, 1500);
	}

	componentWillUnmount() {
		clearTimeout(this.loadingTimeout);
	}
	
	addListeners = (channelId, userId) => {
		this.addMessageListener(channelId);
		this.addStarredListener(channelId, userId);
	}

	/**
	 * Loads and listens for messages
	 */
	addMessageListener = (channelId) => {
		let loadedMessages = [];
		const ref = this.getMessagesRef();
		ref.child(channelId)
			.on('child_added', (snap) => {
				loadedMessages.push(snap.val());
				this.setState({
					messages: loadedMessages,
					noMessages: false,
					messagesLoading: false
				});
				this.countUsers(loadedMessages);
				this.countPosts(loadedMessages);
			});
	}

	/**
	 * Listens for starred status
	 */
	addStarredListener = (channelId, userId) => {
		this.state.usersRef
			.child(userId)
			.child('starred')
			.once('value')
			.then((data) => {
				if (data.val() !== null) {
					const channelIds = Object.keys(data.val());
					const alreadyStarred = channelIds.includes(channelId);
					this.setState({ isChannelStarred: alreadyStarred });
				}
			})
	}

	/**
	 * Get correct reference depending on channel type
	 */
	getMessagesRef = () => {
		const { messagesRef, privateMessagesRef, isPrivateChannel } = this.state;
		return isPrivateChannel ? privateMessagesRef : messagesRef;
	}

	/**
	 * Toggle channel starring status
	 */
	handleStarring = () => {
		this.setState((prevState) => ({
			isChannelStarred: !prevState.isChannelStarred
		}), () => this.starChannel());
	}

	/**
	 * Update channel's starred status
	 */
	starChannel = () => {
		const { isChannelStarred, usersRef, channel, user } = this.state;
		if (isChannelStarred) {
			usersRef
				.child(`${user.uid}/starred`)
				.update({
					[channel.id]: {
						name: channel.name,
						desc: channel.desc,
						createdBy: {
							name: channel.createdBy.name,
							avatar: channel.createdBy.avatar
						}
					}
				});
		} else {
			usersRef
				.child(`${user.uid}/starred`)
				.child(channel.id)
				.remove((err) => {
					console.error(err);
				});
		}
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

	/**
	 * Count num of message authors
	 */
	countUsers = (messages) => {
		const users = messages.reduce((acc, message) => {
			if (!acc.includes(message.user.name)) {
				acc.push(message.user.name);
			}
			return acc;
		}, []);
		this.setState({ userCount: users.length });
	}

	/**
	 * Create an 
	 */
	countPosts = (messages) => {
		let posts = messages.reduce((acc, message) => {
			if (message.user.name in acc) {
				acc[message.user.name].count += 1;
			} else {
				acc[message.user.name] = {
					avatar: message.user.avatar,
					count: 1
				}
			}
			return acc;
		}, {});
		this.props.setChannelUsersPostCounts(posts);
	}

	/**
	 * Set search state on input change
	 */
	handleSearchChange = (event) => {
		this.setState({
			searchTerm: event.target.value,
			searchLoading: true
		}, () => this.handleSearchMessages());
	}

	/**
	 * Grab channel messages related to search
	 */
	handleSearchMessages = () => {
		const channelMessages = [...this.state.messages];
		const regex = new RegExp(this.state.searchTerm, 'gi');
		const searchResults = channelMessages.reduce((acc, message) => {
			if (
				(message.content && message.content.match(regex)) || 
				message.user.name.match(regex)
			) {
				acc.push(message);
			}
			return acc;
		}, []);
		this.setState({ searchResults });
		setTimeout(() => this.setState({ searchLoading: false }), 500);
	}

	render() {
		const { messagesRef, channel, user, messages, messagesLoading, noMessages, userCount, searchResults, searchTerm, searchLoading, isPrivateChannel, isChannelStarred } = this.state;

		return (
			<React.Fragment>
				<MessagesHeader 
					channel={channel} 
					isPrivateChannel={isPrivateChannel}
					userCount={userCount}
					handleSearchChange={this.handleSearchChange}
					searchLoading={searchLoading}
					handleStarring={this.handleStarring}
					isChannelStarred={isChannelStarred}
				/>
				
				<Segment className="messages">
					{noMessages ? (
						<MessageUI 
							compact
							size="tiny"
							icon="inbox"
							header="No messages found."
							content="Be the first by writing a message below!"
						/>
					) : ''}
					{messagesLoading ? (
						<Loader active style={{ marginTop: '2em' }} inline='centered' />
					) : (
						<Comment.Group>
							{searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
						</Comment.Group>
					)}
				</Segment>

				<MessageForm 
					channel={channel}
					messagesRef={messagesRef} 
					currentUser={user}
					isPrivateChannel={isPrivateChannel}
					getMessagesRef={this.getMessagesRef}
				/>
			</React.Fragment>
		)
	}
}

export default connect(null, { setChannelUsersPostCounts })(Messages);