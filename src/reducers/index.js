import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import houseReducer from './house_reducer';
import authReducer from './auth_reducer';


const rootReducer = combineReducers({
  form,
  house: houseReducer,
  auth: authReducer
});

export default rootReducer;
