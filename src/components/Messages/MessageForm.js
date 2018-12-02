import React from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';

import firebase from '../../config/firebase';

class MessageForm extends React.Component {
	state = {
		message: '',
		channel: this.props.channel,
		isLoading: false
	}

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	createMessage = () => {
		const message = {
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			content: this.state.message
		}
	}

	sendMessage = () => {
		const { messagesRef } = this.props;
		const { message, channel } = this.state;

		if (message) {
			messagesRef.child(channel.id)
				.push()
				.set(this.createMessage());
		}
	}

	render() {
		return (
			<Segment className="message-form">
				<Input 
					fluid
					name="message"
					onChange={this.handleChange}
					style={{ marginBottom: '0.7em' }}
					label={<Button icon={'add'} />}
					labelPosition="left"
					placeholder="Write your message"
				/>
				<Button.Group icon size="2">
					<Button 
						onClick={this.sendMessage}
						primary
						content="Send"
						labelPosition="left"
						icon="edit"
					/>
					<Button
						secondary
						icon="cloud upload"
					/>
				</Button.Group>
			</Segment>
		)
	}
}

export default MessageForm;