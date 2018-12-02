import React from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

class MessagesHeader extends React.Component {
	render() {
		return (
			<Segment clearing>
				{ /* Channel Header */ }
				<Header fluid="true" as="h2" floated="left" style={{ marginBottom:0 }}>
					<span>
						{this.props.channel && this.props.channel.name} &nbsp;
						<Icon name="star outline" color="black" size="small" />
					</span>
					<Header.Subheader><small>2 Users</small></Header.Subheader>
				</Header>

				{ /* Channel Search */ }
				<Header floated="right">
					<Input 
						size="mini"
						icon="search"
						name="searchTerm"
						paceholder="Search Messages"
					/>
				</Header>
			</Segment>
		)
	}
}

export default MessagesHeader;