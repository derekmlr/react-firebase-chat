import React from 'react';
import { Comment } from 'semantic-ui-react';
import moment from 'moment';

class Message extends React.Component {
	/**
	 * Apply style if current user is author
	 */
	isOwnMessage = () => {
		return this.props.message.user.id === this.props.user.uid ? 'message__self' : '';
	}

	/**
	 * Make timestamp more human friendly
	 */
	timeFromNow = () => {
		return moment(this.props.message.timestamp).fromNow();
	}

	render() {
		const { message, user } = this.props;
		
		return (
			<Comment>
				<Comment.Avatar src={message.user.avatar} />
				<Comment.Content className={this.isOwnMessage()}>
					<Comment.Author as="a">{message.user.name}</Comment.Author>
					<Comment.Metadata>{this.timeFromNow()}</Comment.Metadata>
					<Comment.Text>{message.content}</Comment.Text>
				</Comment.Content>
			</Comment>
		);
	}
}

export default Message;