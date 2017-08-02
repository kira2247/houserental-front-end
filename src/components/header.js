import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { signoutUser } from '../actions/auth';
import SignUp from './authenticate/signup';
import SignIn from './authenticate/signin';

class Header extends Component {

	constructor () {
	    super();
	    this.state = {
	      showSignUpModal: false,
	      showSignInModal: false,
	    };
  	}
	
	renderLinks() {
		const {tab} = this.props;
		const {ownerShip} = this.props;

		if(tab === 'houseDetails' || tab === 'createRForm'){
			const url = window.location.href.split('/');
			const houseDetailsId = url[5];
			return (
				<ul className="nav navbar-nav">
					<li className="nav-item">
						<Link className="nav-link" to="/houses">Danh Sách Nhà</Link>
					</li>
					{ownerShip ? <li className="nav-item"><Link className="material-button material-button-toggle" to={`/houses/details/${houseDetailsId}/create`}><span className="fa fa-plus" aria-hidden="true"  title="Create room"> Thêm Phòng</span></Link></li> : '' }
				</ul>
			);
		}

		if(tab === 'roomDetails' || tab === 'renterForm' || tab === 'createRecordForm') {
			const url = window.location.href.split('/');
			const houseId = url[5];
			const roomId = url[7];
			return(
				<ul className="nav navbar-nav">
					<li className="nav-item">
						<Link className="nav-link" to="/houses">Danh Sách Nhà</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to={`/houses/details/${houseId}`}>Danh Sách Phòng</Link>
					</li>
					{ownerShip ? <li className="nav-item"><Link className="material-button material-button-toggle" to={`/houses/details/${houseId}/room/${roomId}/add/renter`}  title="Add renter"><span className="fa fa-plus" aria-hidden="true"> Thêm Người Thuê</span></Link></li> :''}
				</ul>
			);
		}

		return (
			<ul className="nav navbar-nav">
				<li className="nav-item">
					<Link className="nav-link" to="/houses">Danh Sách Nhà</Link>
				</li>
				<li className="nav-item">
					<Link className="material-button material-button-toggle" to="/houses/create" title="Create house"><span className="fa fa-plus" aria-hidden="true"> Thêm Nhà</span></Link>
				</li>
			</ul>
		);
	}	

	renderAuthenticateLink() {
		const {authenticated, displayName} = this.props;
		
		if(authenticated) {
			return (				
				<ul className="nav navbar-nav navbar-right">
					<li className="nav-item">
						<a className="nav-link" onClick="">Xin Chào, {displayName}</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" onClick={() => this.props.signoutUser()} >Đăng Xuất <span className="fa fa-sign-out"></span></a>
					</li>
				</ul>				
			)
		}

		return (
			<ul className="nav navbar-nav navbar-right">
				<li className="nav-item">
					<a className="nav-link" onClick={() => this.setState({showSignUpModal:true})} >Đăng Ký <span className="fa fa-registered"></span></a>
				</li>
				<li className="nav-item">
					<a className="material-button material-button-toggle" onClick={() => this.setState({showSignInModal:true})}  title="Create house">Đăng Nhập <span className="fa fa-sign-in"></span></a>
				</li>
			</ul>
		)
	}

	render() {

		return (
			<nav className="navbar navbar-default navbar-inverse" role="navigation">
				<div className="container-fluid">
					<div className="navbar-header">
						<button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
			                <span className="icon-bar"></span>
			                <span className="icon-bar"></span>
			                <span className="icon-bar"></span>
			            </button>
						<Link to="/" className="navbar-brand"  title="Home Page">Trang Chủ</Link>
					</div>
					<center>
						<div className="navbar-collapse collapse" id="navbar-main">
							{this.renderLinks()}
							{this.renderAuthenticateLink()}
						</div>
					</center>
					{this.state.showSignUpModal ? <SignUp 
						isOpenSignUp={this.state.showSignUpModal}
						isClose={() => this.setState({showSignUpModal:false})}
						/> : null}
					{this.state.showSignInModal ? <SignIn
						isOpenSignUp={this.state.showSignInModal}
						isClose={() => this.setState({showSignInModal:false})}
						/> : null}
				</div>
			</nav>
		)
	}
}

function mapStateToProps(state) {
	
	return {
		tab: state.house.tab,
		authenticated: state.auth.authenticated,
		displayName: state.auth.displayName,
		ownerShip: state.house.ownerShip
	}
}

export default connect(mapStateToProps, {signoutUser})(Header);