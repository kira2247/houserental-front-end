import React, { Component } from 'react';
import { connect } from 'react-redux';
import { currentTab } from '../actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';


class roomDetails extends Component {

	componentWillMount() {
		this.props.currentTab('roomDetails');
	}

	render() {
		return (
			<div>This is room details</div>
		);
	}
}

export default connect(null, {currentTab})(roomDetails);