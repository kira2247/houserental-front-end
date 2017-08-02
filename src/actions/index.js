import {
	CREATE_HOUSE,
	UPDATE_HOUSE,
	UPDATE_ROOM,
	UPDATE_RENTER,
	UPDATE_RECORD,
	UPDATE_ERROR,
	CREATE_ROOM,
	CREATE_ERROR,
	CREATE_RENTER,
	CREATE_RECORD,
	GET_ERROR,
	GET_ROOMS,
	GET_ROOM,
	GET_HOUSES,
	GET_FORM,
	CURRENT_TAB,
	DELETE_ROOM,
	DELETE_HOUSE,
	DELETE_IMAGE,
	DELETE_RENTER,
	DELETE_RECORD,
	DELETE_ERROR,
	SET_HOUSE_DETAILS_ID,
	RESET_POST_STATE,
	UNAUTH_USER,
	CHECK_OWNERSHIP
} from './types';
import axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';

const ROOT_URL = 'http://localhost:3000';
const token = localStorage.getItem('token')? '?token=' + localStorage.getItem('token') : '';

export function forceOut() {
	localStorage.removeItem('token');
	localStorage.removeItem('displayName');
	localStorage.removeItem('id');
	location.reload();
	
	return {
		type: UNAUTH_USER
	}
}


export function actionError(err, type){
	return {
		type: type,
		errorMessage: err
	}
}

export function formatFormData(values){
	let formData = new FormData();

	for (const key in values) {
		if(key === 'cidImages'){
			_.map(values[key], (image, index) => {
				formData.append(`${key}[${index}]`, image)
			});
		}
		else {
			formData.append(key, values[key]);
		}
	}
	
	return formData;
	
}


export function createHouse(values, resolve) {
	return function (dispatch) {
		axios.post(`${ROOT_URL}/houses/add${token}`, values)
			.then( response => {
				dispatch({ type: CREATE_HOUSE});
				alert(response.data.message);
				window.location.href = '/houses';
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, CREATE_ERROR));
				resolve()
			});
	}
}

export function createRoom(id, values, resolve) {
	return function (dispatch) {
		axios.post(`${ROOT_URL}/houses/add/${id}${token}`, values)
			.then( response => {
				dispatch({ type: CREATE_ROOM});
				alert(response.data.message);
				window.location.href = `/houses/details/${id}`;				
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, CREATE_ERROR));
				resolve();				
			});
	}
}

export function createRenter(houseid, roomid, values, resolve) {
	const config = { headers: { 'content-type': 'multipart/form-data' } };
	
	return function (dispatch) {		
		axios.post(`${ROOT_URL}/houses/add/${houseid}/${roomid}/renter${token}`, formatFormData(values), config)
			.then( response => {
				dispatch({type: CREATE_RENTER});				
				alert(response.data.message);
				window.location.href = `/houses/details/${houseid}/room/${roomid}`;
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, CREATE_ERROR));
				resolve();						
			});
	}
}

export function createRecord(houseid, roomid, values, resolve) {
	return function (dispatch) {
		
		axios.post(`${ROOT_URL}/houses/add/${houseid}/${roomid}/record${token}`, values)
			.then(response => {
				dispatch({type:CREATE_RECORD});
				alert(response.data.message);
				window.location.href = `/houses/details/${houseid}/room/${roomid}`
			})
			.catch( error => {
				dispatch(actionError(error.response.data.error, CREATE_ERROR));
				resolve()
			});
	}
}

export function fetchHouses() {
	return function (dispatch) {
		axios.get(`${ROOT_URL}/houses`)
			.then( response => {
				dispatch({ type: GET_HOUSES, houses: response.data.houses});
			})
			.catch( error => {				
			});
	}
} 

export function fetchHouseDetailsForm(houseId) {
	return function (dispatch) {
		axios.get(`${ROOT_URL}/houses/form/house/${houseId}${token}`)
			.then( response => {
				dispatch({ type: GET_FORM, formDetails: response.data.house});
			})
			.catch( error => {
				dispatch( actionError(error.response.data.message, GET_ERROR));
			})
	}
}

export function fetchRoomDetailsForm(houseid, roomid) {
	return function (dispatch) {
		axios.get(`${ROOT_URL}/houses/form/house/${houseid}/room/${roomid}${token}`)
			.then( response => {
				dispatch({ type: GET_FORM, formDetails: response.data.room});
			})
			.catch( error => {
				dispatch( actionError(error.response.data.message, GET_ERROR));
			})
	}
}

export function fetchRenterDetailsForm(houseid,roomid, renterid) {
	return function(dispatch) {
		axios.get(`${ROOT_URL}/houses/form/house/${houseid}/room/${roomid}/renter/${renterid}${token}`)
			.then( response => {
				dispatch({ type: GET_FORM, formDetails: response.data.renter});
			})
			.catch( error => {
				console.log(error)
			})
	}
}

export function fetchRecordDetailsForm(houseid, roomid, recordid) {
	return function(dispatch) {
		axios.get(`${ROOT_URL}/houses/form/house/${houseid}/room/${roomid}/record/${recordid}${token}`)
			.then( response => {
				dispatch({ type: GET_FORM, formDetails: response.data.record});
			})
			.catch( error => {
				dispatch( actionError(error.response.data.message, GET_ERROR));
			})
	}
}

export function fetchRooms(houseId) {
	return function (dispatch) {
		axios.get(`${ROOT_URL}/houses/details/${houseId}`)
			.then( response => {
				dispatch({type: GET_ROOMS, rooms: response.data.rooms});
			})
			.catch( error => {
				window.location.href='/error'
			});
	}
}

export function fetchRoomDetails(houseId, roomId){
	return function (dispatch) {
		axios.get(`${ROOT_URL}/houses/details/${houseId}/${roomId}${token}`)
			.then( response => {
				dispatch({type: GET_ROOM, room: response.data.room});
			})
			.catch( error => {
				console.log(error);
				
				if(error.response.data.message === 'Wrong house or room information!') {
					return window.location.href='/error'
				}

				if(error.response.data.message === 'User not match!') {
					alert(error.response.data.message);
					return forceOut();
				}

				window.location.href = `/error`;				
			});
	}
}

export function updateHouseInfo(houseId, values, resolve) {
	return function (dispatch) {
		axios.patch(`${ROOT_URL}/houses/update/house/${houseId}${token}`, values)
			.then( response => {
				dispatch({ type: UPDATE_HOUSE});
				alert(response.data.message);
				window.location.href = '/houses';
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, CREATE_ERROR));
				resolve()
			});
	}
}

export function updateRoomInfo(houseid, roomid, values, resolve) {
	return function (dispatch) {
		axios.patch(`${ROOT_URL}/houses/update/house/${houseid}/room/${roomid}${token}`, values)
			.then( response => {
				dispatch({ type: UPDATE_ROOM});
				alert(response.data.message);
				resolve();
				window.location.href = `/houses/details/${houseid}`;
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, UPDATE_ERROR));
				resolve();
			});
	}
}

export function updateRenterInfo(houseid, roomid, renterid, values, resolve) {
	const config = { headers: { 'content-type': 'multipart/form-data' } };

	return function (dispatch) {
		axios.patch(`${ROOT_URL}/houses/update/house/${houseid}/room/${roomid}/renter/${renterid}${token}`, formatFormData(values), config)
			.then( response => {
				dispatch({ type: UPDATE_RENTER});
				alert(response.data.message);
				resolve();
				window.location.href = `/houses/details/${houseid}/room/${roomid}`;
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, UPDATE_ERROR));
				resolve();
			});
	}
}

export function updateRecordInfo(houseid, roomid, recordid, values, resolve) {
	return function(dispatch) {
	axios.patch(`${ROOT_URL}/houses/update/house/${houseid}/room/${roomid}/record/${recordid}${token}`, values)
			.then(response => {
				dispatch({type:UPDATE_RECORD});
				alert(response.data.message);
				window.location.href = `/houses/details/${houseid}/room/${roomid}`
			})
			.catch( error => {
				dispatch(actionError(error.response.data.error, UPDATE_ERROR));
				resolve()
			});
	}
}

export function deleteImage(publicId, houseid, roomid, renterid, successCb, failCb){
	return function(dispatch) {
		axios.delete(`${ROOT_URL}/houses/delete/house/${houseid}/room/${roomid}/renter/${renterid}/image/${publicId}${token}`)
		.then( response => {
			dispatch({type: DELETE_IMAGE});
			alert(response.data.message);
			successCb();
		}).catch( error => {
			failCb();
			dispatch( actionError(error.response.data.error, CREATE_ERROR));
		});
	}
}

export function deleteRecord(houseid, roomid, recordid, onDeteleStateCb, successCb) {
	return function(dispatch) {
		axios.delete(`${ROOT_URL}/houses/delete/house/${houseid}/room/${roomid}/record/${recordid}${token}`)
		.then( response => {
			dispatch({type: DELETE_RECORD});
			alert(response.data.message);
			onDeteleStateCb();
			successCb();
		}).catch( error => {
			onDeteleStateCb();
			dispatch( actionError(error.response.data.error, DELETE_ERROR));
		})
	}
}

export function deleteRenter(houseid, roomid, renterid, onDeteleStateCb, successCb) {
	return function(dispatch) {
		axios.delete(`${ROOT_URL}/houses/delete/house/${houseid}/room/${roomid}/renter/${renterid}${token}`)
		.then( response => {
			dispatch({type: DELETE_RENTER});
			alert(response.data.message);
			onDeteleStateCb();
			successCb();
		}).catch( error => {
			onDeteleStateCb();
			dispatch( actionError(error.response.data.error, DELETE_ERROR));
		})
	}
}

export function deleteRoom(houseid, roomid, onDeteleStateCb, successCb) {
	return function(dispatch) {
		axios.delete(`${ROOT_URL}/houses/delete/house/${houseid}/room/${roomid}${token}`)
		.then( response => {
			dispatch({type: DELETE_ROOM});
			alert(response.data.message);
			onDeteleStateCb();
			successCb();
		}).catch( error => {
			onDeteleStateCb();
			dispatch( actionError(error.response.data.error, DELETE_ERROR));
		})
	}
}

export function deleteHouse(houseid, onDeteleStateCb, successCb) {
	return function(dispatch) {
		axios.delete(`${ROOT_URL}/houses/delete/house/${houseid}${token}`)
		.then( response => {
			dispatch({type: DELETE_HOUSE});
			alert(response.data.message);
			onDeteleStateCb();
			successCb();
		}).catch( error => {
			onDeteleStateCb();
			alert(error.response.data.error);
			forceOut();
		})
	}
}

export function currentTab(tab) {
	return function (dispatch) {
		dispatch ({
			type: CURRENT_TAB,
			tab: tab
		});
	}
}

export function setIdState(id) {
	return function (dispatch) {
		dispatch ({
			type: SET_HOUSE_DETAILS_ID,
			id: id
		});
	}
}

export function resetPostState() {
	return function (dispatch) {
		dispatch({
			type: RESET_POST_STATE
		});
	}
}

export function checkOwnerShip(houseid, isPrivatePage) {
	const token = localStorage.getItem('token')? 'token=' + localStorage.getItem('token') : '';

	houseid = `houseid=${houseid}`;

	return function (dispatch) {
		axios.get(`${ROOT_URL}/houses/check/ownerShip?${houseid}&${token}`)
		.then( response => {
			dispatch({ type: CHECK_OWNERSHIP, ownerShip: response.data.ownerShip});
			if(!response.data.ownerShip && isPrivatePage) {
				window.location.href="/permission"
			}			
		})
		.catch( error => {
			if(error.response.data.message === 'invalid house') {
				return window.location.href ="/error"
			}
		})
	}
}