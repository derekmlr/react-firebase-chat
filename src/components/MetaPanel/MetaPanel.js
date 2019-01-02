import React from 'react';
import { Segment, Header, Accordion, Icon, Image, List } from 'semantic-ui-react';

class MetaPanel extends React.Component {
	state = {
		activeIndex: 0,
		channel: this.props.currentChannel,
		isPrivateChannel: this.props.isPrivateChannel
	}

	/**
	 * Singular or plural?
	 */
	formatPostCount = (count) => (
		count !== 1 ? `${count} posts` : `${count} post`
	)

	/**
	 * Display each poster in channel, up to 6, sorted by post count
	 */
	displayTopPosters = (postCounts) => (
		Object.entries(postCounts)
			.sort((a, b) => b[1] - a[1])
			.map(([key, val], i) => (
				<List.Item key={i}>
					<Image avatar src={val.avatar} />
					<List.Content>
						<List.Header as="a">{key}</List.Header>
						<List.Description>{this.formatPostCount(val.count)}</List.Description>
					</List.Content>
				</List.Item>
			))
			.slice(0,6)
	);

	/**
	 * For toggling accordion views
	 */
	setActiveIndex = (event, titleProps) => {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;
		this.setState({ activeIndex: newIndex });
	}

	render() {
		const { activeIndex, isPrivateChannel, channel } = this.state;
		const { channelUsersPostCounts } = this.props;

		if (isPrivateChannel) return null;

		return (
			<Segment loading={!channel}>
				<Header as="h3">
					About Channel
				</Header>

				{/* Description */}
				<Accordion styled attached="true">
					<Accordion.Title
						active={channel && activeIndex === 0}
						index={0}
						onClick={this.setActiveIndex}
					>
						<Icon name="dropdown" />
						Description
					</Accordion.Title>
					<Accordion.Content active={channel && activeIndex === 0}>
						{channel && channel.desc}
					</Accordion.Content>

					{/* Top Posters */}
					<Accordion.Title
						active={activeIndex === 1}
						index={1}
						onClick={this.setActiveIndex}
					>
						<Icon name="dropdown" />
						Top Posters
					</Accordion.Title>
					<Accordion.Content active={activeIndex === 1}>
						<List>
							{ channelUsersPostCounts && 
								this.displayTopPosters(channelUsersPostCounts) }
						</List>
					</Accordion.Content>

					{/* Created By */}
					<Accordion.Title
						active={activeIndex === 2}
						index={2}
						onClick={this.setActiveIndex}
					>
						<Icon name="dropdown" />
						Created By
					</Accordion.Title>
					<Accordion.Content active={activeIndex === 2}>
						<Image src={channel && channel.createdBy.avatar} size="mini" avatar />
						{' '}<strong>{channel && channel.createdBy.name}</strong>
					</Accordion.Content>

				</Accordion>
			</Segment>
		)
	}
}

export default MetaPanel;