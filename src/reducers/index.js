import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import houseReducer from './house_reducer';


const rootReducer = combineReducers({
  form,
  house: houseReducer
});

export default rootReducer;
