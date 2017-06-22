import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import Header from './components/header';
import CreateHForm from './components/createHForm';
import CreateRForm from './components/createRForm';
import RenterForm from './components/renterForm';
import Houses from './components/houses';
import HouseDetails from './components/houseDetails';
import RoomDetails from './components/roomDetails';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
  		<div>
  			<Header/>
        <Route exact path="/houses" component={Houses}/>
  			<Route exact path="/houses/create" component={CreateHForm}/>
        <Route exact path="/houses/details/:houseid" component={HouseDetails}/>
        <Route exact path="/houses/details/:houseid/create" component={CreateRForm}/>
        <Route exact path="/houses/details/:houseid/room/:roomid" component={RoomDetails}/>
        <Route exact path="/houses/details/:houseid/room/:roomid/add/renter" component={RenterForm}/>
  		</div>
	</BrowserRouter>
  </Provider>
  , document.querySelector('.app'));
