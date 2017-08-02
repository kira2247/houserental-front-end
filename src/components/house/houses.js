import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import update from 'react-addons-update';

class Houses extends Component {

	constructor(props){
		super(props);
		
		this.state = {
			onDelete : false,
			houses : [],
		};
	}

	componentWillMount() {
		this.props.fetchHouses();
		this.props.currentTab('houses');
		
	}

	componentWillUnmount() {
		
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.houses !=this.props.houses) {
			this.setState({
				houses: nextProps.houses			
			})
		}
	}

	renderOptions(house, houseIndex) {		
		if (localStorage.getItem('id') === house.creator._id) {
			return (
				<div className="option-gr">
					<div className="footer col-sm-4">
						<Link className="option-gr btn btn-lg btn-block btn-info" to={`/houses/details/${house._id}`}>Chi Tiết</Link>
					</div>
					<div className="footer col-sm-4">
						<Link className="option-gr btn btn-lg btn-block btn-primary" to={`/houses/edit/${house._id}`} >Sửa</Link>
					</div>
					<div className="footer col-sm-4">
						<a className="option-gr btn btn-lg btn-block btn-danger" onClick={!this.state.onDelete && this.props.authenticated ? this.removeHouse.bind(this, house._id, house.address, houseIndex) : null}>Xóa</a>
					</div>
				</div>
			)
		}

		return (
			<div className="option-gr">
				<div className="footer col-sm-12">
					<Link className="option-gr btn btn-lg btn-block btn-info" to={`/houses/details/${house._id}`}>Chi Tiết</Link>
				</div>
			</div>
		)
	}

	renderHouses() {
		const {houses} = this.state;

		if (typeof houses !="undefined" && houses.length === 0 ) {
			return (<div className="text-danger text-center">Chưa có nhà nào được tạo. Vui lòng thêm nhà !</div>)
		}

		return _.map(houses, (house,index) => {
			return (
				<div className="col-sm-12 text center" key={house._id}>
					<div className="panel panel-success panel-pricing">
						<div className="panel-heading">
							<i className="fa fa-home"></i>
							<h4>Chủ Nhà: {house.ownersName} | SĐT: {house.phoneNumber} {house.totalRoom ? "| Tổng Số Phòng: " + house.totalRoom : ''}</h4>
						</div>
						<div className="panel-body text-center">
							<p><strong>Địa Chỉ: {house.address}</strong></p>
						</div>
						<ul className="list-group text-center">
							<li className="list-group-item"><i className="fa fa-check"></i>Đối Tượng Cho Thuê: {house.rentalTargets}</li>
						</ul>
					</div>
					{this.renderOptions(house, index)}
				</div>
			);
		});
		
	}

	removeHouse(houseid, address, index){		
		if(confirm('Delete house have address: '+ address)){
			this.setState({ onDelete:true });
			this.props.deleteHouse(houseid, () => {
				this.setState({ onDelete:false});
			},
				() => {
					this.setState({houses: update(this.state.houses, {$splice: [[index,1]]})})
			})
		}
	}

	render() {		
		return (
			<div className="housesPageContainer">
				<h3 className="text-info form-text">Danh Sách Nhà:</h3>
				<hr/>
				{this.renderHouses()}
			</div>			
		);
	}
}

function mapStateToProps(state) {
	return {
		houses: state.house.houses,
		authenticated: state.auth.authenticated
	}
}

export default connect(mapStateToProps, actions)(Houses);