import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

import firebase from '../../config/firebase';

class Channels extends React.Component {
	state = {
		user: this.props.currentUser,
		channels: [],
		modal: false,
		channelName: '',
		channelDesc: '',
		channelsRef: firebase.database().ref('channels')
	}

	componentDidMount() {
		this.addListeners();
	}

	addListeners = () => {
		let loadedChannels = [];
		this.state.channelsRef.on('child_added', (snap) => {
			loadedChannels.push(snap.val());
			this.setState({ channels: loadedChannels });
		});
	}

	openModal = () => this.setState({ modal: true });

	closeModal = () => this.setState({ modal: false });

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	addChannel = () => {
		const { channelsRef, channelName, channelDesc, user } = this.state;
		const key = channelsRef.push().key;

		const newChannel = {
			id: key,
			name: channelName,
			desc: channelDesc,
			owner_id: user.uid
		};

		channelsRef
			.child(key)
			.update(newChannel)
			.then(() => {
				this.setState({ channelName: '', channelDesc: '' });
				this.closeModal();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleSubmit = (event) => {
		event.preventDefault();
		if (this.isFormValid(this.state)) {
			this.addChannel();
		}
	}

	isFormValid = ({ channelName, channelDesc }) => channelName && channelDesc;

	displayChannels = (channels) => (
		channels.length > 0 && channels.map((channel) => (
			<Menu.Item 
				key={channel.id} 
				onClick={() => console.log(channel)} 
				name={channel.name} 
				style={{ opacity: 0.7 }} 
			>
				# {channel.name}
			</Menu.Item>
		))
	)

	render() {
		const { channels, modal } = this.state;

		return (
			<React.Fragment>
				<Menu.Menu style={{ paddingBottom: '2em' }}>
					<Menu.Item>
						<span>
							<Icon name="exchange" /> CHANNELS
						</span>{' '}
						({ channels.length }) <Icon name="add" onClick={this.openModal} />
					</Menu.Item>
					{this.displayChannels(channels)}
				</Menu.Menu>

				{ /* Add channel modal */ }
				<Modal basic open={modal} onClose={this.closeModal}>
					<Modal.Header>Add a Channel</Modal.Header>
					<Modal.Content>
						<Form onSubmit={this.handleSubmit}>
							<Form.Field>
								<Input 
									fluid
									label="Name of channel"
									name="channelName"
									onChange={this.handleChange}
								/>
							</Form.Field>
							<Form.Field>
								<Input 
									fluid
									label="Description"
									name="channelDesc"
									onChange={this.handleChange}
								/>
							</Form.Field>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button primary onClick={this.handleSubmit}>
							Add
						</Button>
						<Button secondary onClick={this.closeModal}>
							Cancel
						</Button>
					</Modal.Actions>
				</Modal>
			</React.Fragment>
		)
	}
}

export default Channels;