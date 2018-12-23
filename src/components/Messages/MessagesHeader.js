import React from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

class MessagesHeader extends React.Component {
	render() {
		const { channel, userCount, handleSearchChange, searchLoading, isPrivateChannel } = this.props;

		console.log(isPrivateChannel);

		return (
			<Segment clearing>
				{ /* Channel Header */ }
				<Header fluid="true" as="h2" floated="left" style={{ marginBottom:0 }}>
					<span>
						{channel && `${isPrivateChannel ? '@' : '#'}${channel.name}`} &nbsp;
						{!isPrivateChannel && <Icon name="star outline" color="black" size="small" />}
					</span>
					<Header.Subheader>
						<small><strong>{userCount}</strong> {userCount === 1 ? 'user' : 'users'}</small>
					</Header.Subheader>
				</Header>

				{ /* Channel Search */ }
				<Header floated="right" style={{ marginTop: '0.4em' }}>
					<Input 
						loading={searchLoading}
						onChange={handleSearchChange}
						size="mini"
						icon="search"
						name="searchTerm"
						placeholder="Search Messages"
					/>
				</Header>
			</Segment>
		)
	}
}

export default MessagesHeader;