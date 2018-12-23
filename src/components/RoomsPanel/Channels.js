import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

import { setCurrentChannel, setPrivateChannel } from '../../actions';

import firebase from '../../config/firebase';

class Channels extends React.Component {
	state = {
		user: this.props.currentUser,
		channels: [],
		modal: false,
		channelName: '',
		channelDesc: '',
		channelsRef: firebase.database().ref('channels'),
		activeChannel: '',
		initialLoad: true
	}

	componentDidMount() {
		this.addListeners();
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	/**
	 * Listens for channel data changes
	 */
	addListeners = () => {
		let loadedChannels = [];
		this.state.channelsRef.on('child_added', (snap) => {
			loadedChannels.push(snap.val());
			this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
		});
	}
	removeListeners = () => {
		this.state.channelsRef.off();
	}

	/**
	 * Set current channel on initial load
	 */
	setFirstChannel = () => {
		const firstChannel = this.state.channels[0];
		if (this.state.initialLoad && this.state.channels.length > 0) {
			this.props.setCurrentChannel(firstChannel);
			this.setActiveChannel(firstChannel);
		}
		this.setState({ initialLoad: false });
	}

	/**
	 * Modal toggle
	 */
	openModal = () => this.setState({ modal: true });
	closeModal = () => this.setState({ modal: false });

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	/**
	 * Add a new channel node
	 */
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

	/**
	 * Submit new channel form
	 */
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.isFormValid(this.state)) {
			this.addChannel();
		}
	}

	/**
	 * Check that channel form data is set
	 */
	isFormValid = ({ channelName, channelDesc }) => channelName && channelDesc;

	/**
	 * Display channel items
	 */
	displayChannelsList = (channels) => (
		channels.length > 0 && channels.map((channel) => (
			<Menu.Item 
				key={channel.id} 
				onClick={() => this.changeChannel(channel)} 
				name={channel.name} 
				active={channel.id === this.state.activeChannel}
				className="menu-item"
			>
				# {channel.name}
			</Menu.Item>
		))
	)

	/**
	 * Handle onClick channel changing
	 */
	changeChannel = (channel) => {
		this.setActiveChannel(channel);
		this.props.setCurrentChannel(channel);
		this.props.setPrivateChannel(false);
	}

	/**
	 * Set currently active channel indication
	 */
	setActiveChannel = (channel) => {
		this.setState({ activeChannel: channel.id });
	}

	render() {
		const { channels, modal } = this.state;

		return (
			<React.Fragment>
				<Menu.Menu className="menu">
					<Menu.Item>
						<span className="menu-header">
							Channels ({ channels.length })
						</span>
						<Icon name="add" onClick={this.openModal} />
					</Menu.Item>
					{this.displayChannelsList(channels)}
				</Menu.Menu>

				{ /* Add channel modal */ }
				<Modal size="tiny" open={modal} onClose={this.closeModal}>
					<Modal.Header>Create a new Channel</Modal.Header>
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
							Add Channel
						</Button>
						<Button onClick={this.closeModal}>
							Cancel
						</Button>
					</Modal.Actions>
				</Modal>
			</React.Fragment>
		)
	}
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);