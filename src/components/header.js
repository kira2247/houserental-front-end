import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { currentTab } from '../actions';

class Header extends Component {

	componentWillMount() {
		this.props.currentTab('header');
	}	

	renderLinks() {
		const {tab} = this.props;

		if(tab === 'houseDetails'){
			const houseDetailsId = window.location.href.split('/').pop() ;
			return (
				<ul className="nav navbar-nav">
					<li className="nav-item">
						<Link className="nav-link" to="/houses">Houses</Link>
					</li>
					<li className="nav-item">
						<Link className="material-button material-button-toggle" to={`/houses/details/${houseDetailsId}/create`}><span className="fa fa-plus" aria-hidden="true"></span></Link>
					</li>
				</ul>
			);
		}

		if(tab === 'roomDetails') {
			const url = window.location.href.split('/');
			const houseId = url[5];
			const roomId = url[7];
			return(
				<ul className="nav navbar-nav">
					<li className="nav-item">
						<Link className="nav-link" to="/houses">Houses</Link>
					</li>
					<li className="nav-item">
						<Link className="material-button material-button-toggle" to={`/houses/details/${houseId}/room/${roomId}/add/renter`}><span className="fa fa-plus" aria-hidden="true"></span></Link>
					</li>
				</ul>
			);
		}

		return (
			<ul className="nav navbar-nav">
				<li className="nav-item">
					<Link className="nav-link" to="/houses">Houses</Link>
				</li>
				<li className="nav-item">
					<Link className="material-button material-button-toggle" to="/houses/create"><span className="fa fa-plus" aria-hidden="true"></span></Link>
				</li>
			</ul>
		);
	}

	render() {
		return (
			<nav className="navbar navbar-light">
				<Link to="/" className="navbar-brand">HOME</Link>
				{this.renderLinks()}
			</nav>
		)
	}
}

function mapStateToProps(state) {
	return {
		tab: state.house.tab
	}
}



export default connect(mapStateToProps, {currentTab})(Header);