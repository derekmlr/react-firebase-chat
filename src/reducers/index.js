import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

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
	user: user_reducer
});

export default rootReducer;