import React from 'react';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment';

class Message extends React.Component {
	/**
	 * Apply style if current user is author
	 */
	isOwnMessage = () => {
		return this.props.message.user.id === this.props.user.uid ? 'message__self' : '';
	}

	/**
	 * Is the message's type an image?
	 */
	isImage = (message) => {
		return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
	}

	/**
	 * Make timestamp more human friendly
	 */
	timeFromNow = () => {
		return moment(this.props.message.timestamp).fromNow();
	}

	render() {
		const { message } = this.props;
		
		return (
			<Comment>
				<Comment.Avatar src={message.user.avatar} />
				<Comment.Content className={this.isOwnMessage()}>
					<Comment.Author as="a">{message.user.name}</Comment.Author>
					<Comment.Metadata>{this.timeFromNow()}</Comment.Metadata>
					{this.isImage(message) ? (
						<Image src={message.image} className="message-img" />
					) : <Comment.Text>{message.content}</Comment.Text> }
				</Comment.Content>
			</Comment>
		);
	}
}

export default Message;