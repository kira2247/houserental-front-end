import {
	AUTH_USER,
	UNAUTH_USER,
	AUTH_ERROR,
	RESET_POST_STATE
} from '../actions/types';


export default function (state={}, action) {
	switch(action.type) {
		case AUTH_USER:
			return {...state, error:'', authenticated: true, displayName: action.displayName};
		case UNAUTH_USER:
			return {...state, authenticated:false};
		case AUTH_ERROR:
			return {...state, errorMessage: action.payload}
		case RESET_POST_STATE:
			return { ...state, errorMessage: null}
	}

	return state;
}