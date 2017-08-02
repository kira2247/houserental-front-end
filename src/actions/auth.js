import axios from 'axios';
import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, RESET_POST_STATE} from './types';

const ROOT_URL = 'https://houserental-server.herokuapp.com';

export function authError(error) {
	return {
		type: AUTH_ERROR,
		payload: error
	}
}

export function signinUser({email, password}) {
	
	return function(dispatch) {
		axios.post(`${ROOT_URL}/user/signin`, {email,password})
			.then(response => {
				dispatch({ type: AUTH_USER});				
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('displayName', response.data.displayName);
				localStorage.setItem('id', response.data.id);
				window.location.href = '/houses';						
			})
			.catch(() => {
				dispatch(authError('Bad Login Info'));
			});
	}
}

export function signupUser({email, password, displayName}) {
	return function(dispatch) {
		axios.post(`${ROOT_URL}/user/signup`, {email, password, displayName})
			.then( response => {
				dispatch({type: AUTH_USER});
				alert(response.data.message);
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('displayName', response.data.displayName);
				localStorage.setItem('id', response.data.id);
				window.location.href = '/houses';				
			})
			.catch( error => {
				dispatch (authError(error.response.data.error));
			});
	}	
}	

export function signoutUser() {
	localStorage.removeItem('token');
	localStorage.removeItem('displayName');
	localStorage.removeItem('id');
	window.location.href = '/houses';

	return {
		type: UNAUTH_USER
	}
}

export function resetPostState() {
	return function (dispatch) {
		dispatch({
			type: RESET_POST_STATE
		});
	}
}