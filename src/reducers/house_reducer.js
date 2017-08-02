import {
	UPLOAD_IMAGE,
	CREATE_ERROR,
	UPDATE_ERROR,
	GET_HOUSES,
	GET_ROOMS,
	GET_ROOM,
	GET_FORM,
	CURRENT_TAB,
	SET_HOUSE_DETAILS_ID,
	RESET_POST_STATE,
	CHECK_OWNERSHIP
} from '../actions/types';


export default function (state={}, action) {
	switch(action.type) {
		case UPLOAD_IMAGE:
			return { ...state}
		case GET_HOUSES:
			return { ...state, houses: action.houses};
		case GET_FORM:
			return { ...state, formDetails: action.formDetails};
		case GET_ROOMS:
			return { ...state, rooms: action.rooms};
		case GET_ROOM:
			return { ...state, room: action.room};
		case RESET_POST_STATE:
			return { ...state, formDetails: null, errorMessage: null, ownerShip: null};
		case CURRENT_TAB:
			return { ...state, tab: action.tab};
		case SET_HOUSE_DETAILS_ID:
			return { ...state, id: action.id};
		case CREATE_ERROR:
			return { ...state, errorMessage: action.errorMessage};
		case UPDATE_ERROR:
			return { ...state, errorMessage: action.errorMessage};
		case CHECK_OWNERSHIP:
			return { ...state, ownerShip: action.ownerShip};
		default:
			return { ...state}
	}

	return state;
}