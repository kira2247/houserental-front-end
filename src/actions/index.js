import {
	CREATE_HOUSE,
	CREATE_ROOM,
	CREATE_ERROR,
	UPLOAD_IMAGE,
	GET_ERROR,
	GET_ROOMS,
	GET_HOUSES,
	CURRENT_TAB,
	SET_HOUSE_DETAILS_ID
} from './types';
import axios from 'axios';
import superagent from 'superagent';

const ROOT_URL = 'http://localhost:3000';


export function actionError(err, type){
	return {
		type: type,
		payload: err
	}
}


export function createHouse({ownersName,address,phoneNumber,rentalTargets,totalRoom}) {
	return function (dispatch) {
		axios.post(`${ROOT_URL}/houses/create`, {ownersName,address,phoneNumber,rentalTargets,totalRoom})
			.then( response => {
				dispatch({ type: CREATE_HOUSE});
				alert(response.data.message);
				window.location.href = '/houses';
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, CREATE_ERROR));
			});
	}
}

export function createRoom(id, {roomName, roomPrice, elecRate, waterRate, note}) {
	return function (dispatch) {
		axios.post(`${ROOT_URL}/houses/details/${id}/create`, {roomName, roomPrice, elecRate, waterRate, note})
			.then( response => {
				dispatch({ type: CREATE_ROOM});
				alert(response.data.message);
				window.location.href = `/houses/details/${id}`;
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, CREATE_ERROR));
			});
	}
}

export function uploadImage({cidImages}) {
	// const config = {headers: { 'content-type': 'multipart/form-data' }};
	
	return function (dispatch) {
		axios.post(`${ROOT_URL}/houses/add/image`, cidImages)
			.then( response => {
				dispatch({ type: UPLOAD_IMAGE});
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, CREATE_ERROR));
			});
			
		// 	
		// superagent.post(`${ROOT_URL}/houses/add/image`)
		// 	.send({idImages})
		// 	.end((err,res) => {
		// 		console.log(err);
		// 		console.log(res);
		// 	});
	}
}


export function fetchHouses() {
	return function (dispatch) {
		axios.get(`${ROOT_URL}/houses`)
			.then( response => {
				dispatch({ type: GET_HOUSES, houses: response.data.houses});
			})
			.catch( error => {
				dispatch( actionError(error.response.data.error, GET_ERROR));
			});
	}
} 

export function fetchRooms(houseId) {
	return function (dispatch) {
		axios.get(`${ROOT_URL}/houses/details/${houseId}`)
			.then( response => {
				dispatch({type: GET_ROOMS, rooms: response.data.rooms});
			})
			.catch( error => {
				dispatch( actionError(error.response.data.message, GET_ERROR));
			});
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