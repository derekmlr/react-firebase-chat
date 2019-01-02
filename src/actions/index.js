import * as actionTypes from './types';

/**
 * Channel Actions
 */
export const setCurrentChannel = (channel) => {
	return {
		type: actionTypes.SET_CURRENT_CHANNEL,
		payload: {
			currentChannel: channel
		}
	}
}
export const setPrivateChannel = (isPrivateChannel) => {
	return {
		type: actionTypes.SET_PRIVATE_CHANNEL,
		payload: {
			isPrivateChannel
		}
	}
}
export const setChannelUsersPostCounts = (posts) => {
	return {
		type: actionTypes.SET_CHANNEL_USERS_POST_COUNTS,
		payload: {
			posts
		}
	}
}

/**
 * User Actions
 */
export const setUser = (user) => {
	return {
		type: actionTypes.SET_USER,
		payload: {
			currentUser: user
		}
	}
}

export const clearUser = () => {
	return {
		type: actionTypes.CLEAR_USER
	}
}