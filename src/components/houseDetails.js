import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchRooms, currentTab} from '../actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';


class HouseDetails extends Component {
	renderRooms(){
		const {rooms} = this.props;
		if(typeof rooms !=="undefined" && rooms.length === 0) {
			return (<div className="text-danger text-center">Chưa có phòng nào được tạo. Vui lòng tạo phòng !</div>);
		}
		return _.map(rooms, room => {
			return (
				<div className="col-sm-12 text center" key={room._id}>
					<div className="panel panel-success panel-pricing">
						<div className="panel-heading">
							<i className="fa fa-user-circle"></i>
							<h4>Phòng: {room.roomName} | Giá: {room.roomPrice} | Số Người: {room.renters.length}</h4>
						</div>
						<div className="panel-body text-center">
							<p><strong>Tỉ Giá Điện (vnd/kWh): {room.elecRate}  | Tỉ Giá Nước (vnd/m3): {room.waterRate} </strong></p>
						</div>
						<ul className="list-group text-center">
							<li className="list-group-item"><i className="fa fa-check"></i>Ghi chú( Số Điện Nước Lúc Vào ): {room.note}</li>
						</ul>
						<div className="footer col-sm-4">
							<Link className="btn btn-lg btn-block btn-info" to={`/houses/details/${this.props.match.params.houseid}/room/${room._id}`} >Chi Tiết</Link>
						</div>
						<div className="footer col-sm-4">
							<Link className="btn btn-lg btn-block btn-primary" to="#" >Sửa</Link>
						</div>
						<div className="footer col-sm-4">
							<Link className="btn btn-lg btn-block btn-danger" to="#" >Xóa</Link>
						</div>
					</div>
				</div>
			);
		});
	}

	componentWillMount() {
		this.props.currentTab('houseDetails');
		this.props.fetchRooms(this.props.match.params.houseid);
	}

	render() {
		return (
			<div>
				<h3 className="text-info">Danh Sách Phòng:</h3>
				<hr/>
				{this.renderRooms()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		rooms: state.house.rooms
	}
}

export default connect(mapStateToProps, {currentTab, fetchRooms})(HouseDetails);