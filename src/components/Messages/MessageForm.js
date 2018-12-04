import React from 'react';
import uuid4 from 'uuid/v4'
import { Segment, Input, Button, Form } from 'semantic-ui-react';

import MessageUploadModal from './MessageUploadModal';
import ProgressBar from './ProgressBar';

import firebase from '../../config/firebase';

class MessageForm extends React.Component {
	state = {
		message: '',
		channel: this.props.channel,
		user: this.props.currentUser,
		errors: [],
		isLoading: false,
		uploadModal: false,
		uploadState: '',
		uploadTask: null,
		storageRef: firebase.storage().ref(),
		percentUploaded: 0
	}

	/**
	 * Toggle upload modal
	 */
	openUploadModal = () => this.setState({ uploadModal: true });
	closeUploadModal = () => this.setState({ uploadModal: false });

	/**
	 * Sets input values in state
	 */
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	/**
	 * Create message object to send
	 */
	createMessage = (fileURL = null) =>{
		const message = {
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			user: {
				id: this.state.user.uid,
				avatar: this.state.user.photoURL,
				name: this.state.user.displayName
			}
		}

		// Set message type by inserting a image OR content (text) property.
		if (fileURL !== null) {
			message['image'] = fileURL;
		} else {
			message['content'] = this.state.message;
		}

		return message;
	};

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

	/**
	 * Upload file to Firebase storage
	 */
	uploadFile = (file, metadata) => {
		const channelId = this.state.channel.id;
		const ref = this.props.messagesRef;
		const filePath = `chat/public/${uuid4()}.png`;

		this.setState({
			uploadState: 'uploading',
			uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
		}, () => {
			// Track progress of upload
			this.state.uploadTask.on('state_changed', (snap) => {
				const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
				this.setState({ percentUploaded });
			}, (err) => {
				console.error(err);
				this.setState({
					errors: this.state.errors.concat(err),
					uploadState: 'error',
					uploadTask: null
				});
			}, () => {
				// Get download URL after upload
				this.state.uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
					this.sendFileMessage(downloadURL, ref, channelId);
				})
				.catch((err) => {
					console.error(err);
					this.setState({
						errors: this.state.errors.concat(err),
						uploadState: 'error',
						uploadTask: null
					});
				})
			})
		});
	}

	/**
	 * Send image as user's message
	 */
	sendFileMessage = (fileURL, ref, channelId) => {
		ref.child(channelId)
			.push()
			.set(this.createMessage(fileURL))
			.then(() => {
				this.setState({ uploadState: 'done' });
			})
			.catch((err) => {
				console.log(err);
				this.setState({
					errors: this.state.errors.concat(err)
				});
			});
	}

	render() {
		const { errors, message, isLoading, uploadModal, uploadState, percentUploaded } = this.state;

		return (
			<Segment className="message-form">
				<Form autoComplete="off">
					<Form.Group inline style={{ marginBottom:0 }}>
						<Form.Field width={14}>
							<Input
								name="message"
								label={<Button type="button" icon="camera" onClick={this.openUploadModal}></Button>}
								onChange={this.handleChange}
								labelPosition="left"
								placeholder="Write your message"
								className={
									errors.some(err => err.message.includes("message")) ? "error" : ""
								}
								value={message}
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

						<MessageUploadModal 
							modal={uploadModal}
							closeModal={this.closeUploadModal}
							uploadFile={this.uploadFile}
						/>
					</Form.Group>
				</Form>

				<ProgressBar
					uploadState={uploadState}
					percentUploaded={percentUploaded}
				/>
			</Segment>
		)
	}
}

export default MessageForm;