import React from 'react';
import { Segment, Input, Button, Form } from 'semantic-ui-react';

import firebase from '../../config/firebase';

class MessageForm extends React.Component {
	state = {
		message: '',
		channel: this.props.channel,
		user: this.props.currentUser,
		errors: [],
		isLoading: false
	}

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	/**
	 * Create message object to send
	 */
	createMessage = () => ({
		timestamp: firebase.database.ServerValue.TIMESTAMP,
		content: this.state.message,
		user: {
			id: this.state.user.uid,
			avatar: this.state.user.photoURL,
			name: this.state.user.displayName
		}
	});

	/**
	 * Send message to Firebase store
	 */
	sendMessage = () => {
		const { messagesRef } = this.props;
		const { message, channel } = this.state;

		if (message) {
			this.setState({ isLoading: true });
			messagesRef.child(channel.id)
				.push()
				.set(this.createMessage())
				.then(() => {
					this.setState({ isLoading: false, message: '' });
				})
				.catch((err) => {
					console.log(err);
					this.setState({
						isLoading: false,
						errors: this.state.errors.concat(err)
					});
				});
		} else {
			this.setState({
				isLoading: false,
				errors: this.state.errors.concat({ message: 'Cannot send a blank message.' })
			});
		}
	}

	/**
	 * Submit message if user hits enter key
	 */
	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.sendMessage();
		}
	}

	render() {
		const { errors, message, isLoading } = this.state;

		return (
			<Segment className="message-form">
				<Form>
					<Form.Group inline style={{ marginBottom:0 }}>
						<Form.Field width={14}>
							<Input
								name="message"
								onChange={this.handleChange}
								label={<Button icon={'cloud upload'} />}
								labelPosition="left"
								placeholder="Write your message"
								value={message}
								className={
									errors.some((err) => err.includes('message')) ? 'error' : ''
								}
								onKeyPress={this.handleKeyPress}
							/>
						</Form.Field>
						<Form.Field width={2} style={{ paddingRight:0 }}>
							<Button 
								fluid
								primary
								onClick={this.sendMessage}
								disabled={isLoading}
								icon="paper plane"
							/>
						</Form.Field>
					</Form.Group>
				</Form>
			</Segment>
		)
	}
}

export default MessageForm;