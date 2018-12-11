import React from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

class MessagesHeader extends React.Component {
	render() {
		const { channel, userCount, handleSearchChange, searchLoading } = this.props;

		return (
			<Segment clearing>
				{ /* Channel Header */ }
				<Header fluid="true" as="h2" floated="left" style={{ marginBottom:0 }}>
					<span>
						{channel && `#${channel.name}`} &nbsp;
						<Icon name="star outline" color="black" size="small" />
					</span>
					<Header.Subheader>
						<small><strong>{userCount}</strong> {userCount > 1 ? 'users' : 'user'}</small>
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