import {
	CREATE_HOUSE,
	UPLOAD_IMAGE,
	GET_HOUSES,
	GET_ROOMS,
	CURRENT_TAB,
	SET_HOUSE_DETAILS_ID,
	CREATE_ROOM
} from '../actions/types';


export default function (state={}, action) {
	switch(action.type) {
		case CREATE_HOUSE:
			return { ...state, createSuccess: true};
		case UPLOAD_IMAGE:
			return {...state}
		case GET_HOUSES:
			return { ...state, houses: action.houses};
		case GET_ROOMS:
			return { ...state, rooms: action.rooms};
		case CURRENT_TAB:
			return {...state, tab: action.tab};
		case SET_HOUSE_DETAILS_ID:
			return {...state, id: action.id};
		case CREATE_ROOM:
			return { ...state};
	}

	return state;
}