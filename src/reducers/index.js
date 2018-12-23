import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

/**
 * Channel Reducer
 * 
 * @param {Object} state 
 * @param {Object} action 
 */
const initialChannelState = {
	currentChannel: null,
	isPrivateChannel: false
}
const channel_reducer = (state = initialChannelState, action) => {
	switch(action.type) {
		case actionTypes.SET_CURRENT_CHANNEL:
			return {
				...state,
				currentChannel: action.payload.currentChannel
			}
		case actionTypes.SET_PRIVATE_CHANNEL:
			return {
				...state,
				isPrivateChannel: action.payload.isPrivateChannel
			}
		default:
			return state;
	}
}

/**
 * User Reducer
 * 
 * @param {Object} state 
 * @param {Object} action 
 */
const initialUserState = {
	currentUser: null,
	isLoading: true
}
const user_reducer = (state = initialUserState, action) => {
	switch(action.type) {
		case actionTypes.SET_USER:
			return {
				...state,
				currentUser: action.payload.currentUser,
				isLoading: false
			}
		case actionTypes.CLEAR_USER:
			return {
				...initialUserState,
				isLoading: false
			}
		default:
			return state;
	}
}

/**
 * Combine all reducers via Redux & export
 */
const rootReducer = combineReducers({
	channel: channel_reducer,
	user: user_reducer
});

export default rootReducer;