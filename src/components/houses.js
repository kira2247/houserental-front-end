import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchHouses, currentTab, setIdState } from '../actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';

class Houses extends Component {

	componentWillMount() {
		this.props.fetchHouses();
		this.props.currentTab('houses');
	}

	onLinkClick(id){
		this.props.setIdState(id);
	}

	renderHouses() {
		const {houses} = this.props;
		if (typeof houses !="undefined" && houses.length === 0 ) {
			return (<div className="text-danger text-center">Chưa có nhà nào được tạo. Vui lòng tạo nhà !</div>)
		}

		return _.map(houses, house => {
			return (
				<div className="col-sm-12 text center" key={house._id}>
					<div className="panel panel-success panel-pricing">
						<div className="panel-heading">
							<i className="fa fa-home"></i>
							<h4>Chủ Nhà: {house.ownersName} | SĐT: {house.phoneNumber} | Tổng Số Phòng: {house.totalRoom}</h4>
						</div>
						<div className="panel-body text-center">
							<p><strong>Địa Chỉ: {house.address}</strong></p>
						</div>
						<ul className="list-group text-center">
							<li className="list-group-item"><i className="fa fa-check"></i>Đối Tượng Cho Thuê: {house.rentalTargets}</li>
						</ul>
						<div className="footer col-sm-4">
							<Link className="btn btn-lg btn-block btn-info" to={`/houses/details/${house._id}`} onClick={this.onLinkClick.bind(this, house._id)}>Chi Tiết</Link>
						</div>
						<div className="footer col-sm-4">
							<Link className="btn btn-lg btn-block btn-primary" to="#" onClick={this.onLinkClick.bind(this, house._id)}>Sửa</Link>
						</div>
						<div className="footer col-sm-4">
							<Link className="btn btn-lg btn-block btn-danger" to="#" onClick={this.onLinkClick.bind(this, house._id)}>Xóa</Link>
						</div>
					</div>
				</div>
			);
		});
		
	}

	render() {
		return (
			<div>
				<h3 className="text-info">Danh Sách Nhà:</h3>
				<hr/>
				{this.renderHouses()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		houses: state.house.houses
	}
}

export default connect(mapStateToProps,{fetchHouses, currentTab, setIdState})(Houses);