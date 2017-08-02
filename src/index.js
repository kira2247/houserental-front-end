import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import Header from './components/header';
import CreateHForm from './components/house/createHForm';
import CreateRForm from './components/house/createRForm';
import CreateRecordForm from './components/house/createRecordForm';
import RenterForm from './components/house/renterForm';
import Houses from './components/house/houses';
import HouseDetails from './components/house/houseDetails';
import RoomDetails from './components/house/roomDetails';
import reducers from './reducers';
import SignUp from './components/authenticate/signup'
import RequireAuth from './components/authenticate/require_authenticate';
import PageNotFound from './components/errors/404';
import PermissionDenied from './components/errors/permissionDenied';
import { AUTH_USER } from './actions/types';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);
const token = localStorage.getItem('token');
const displayName = localStorage.getItem('displayName');

if(token) {
  store.dispatch({type: AUTH_USER, displayName: displayName});
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
  		<div>
        <Header/>
        <Switch>
          <Route exact path="/" component={Houses}/>
          <Route exact path="/houses" component={Houses}/>
    			<Route exact path="/houses/create" component={RequireAuth(CreateHForm)}/>
          <Route exact path="/houses/edit/:houseid" component={RequireAuth(CreateHForm)}/>
          <Route exact path="/houses/details/:houseid" component={HouseDetails}/>
          <Route exact path="/houses/details/:houseid/create" component={RequireAuth(CreateRForm)}/>
          <Route exact path="/houses/edit/:houseid/:roomid" component={RequireAuth(CreateRForm)}/>
          <Route exact path="/houses/details/:houseid/room/:roomid" component={RequireAuth(RoomDetails)}/>
          <Route exact path="/houses/details/:houseid/room/:roomid/add/renter" component={RequireAuth(RenterForm)}/>
          <Route exact path="/houses/edit/:houseid/room/:roomid/renter/:renterid" component={RequireAuth(RenterForm)}/>
          <Route exact path="/houses/details/:houseid/room/:roomid/add/record" component={RequireAuth(CreateRecordForm)}/>
          <Route exact path="/houses/edit/:houseid/room/:roomid/record/:recordid" component={RequireAuth(CreateRecordForm)}/>
          <Route exact path="/permission" component={PermissionDenied}/>
          <Route component={PageNotFound}/>
        </Switch>
  		</div>
	</BrowserRouter>
  </Provider>
  , document.querySelector('.app'));
