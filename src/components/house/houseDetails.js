import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import update from 'react-addons-update';
import moment from 'moment';
import Pagination from '../paginations'

class HouseDetails extends Component {
	
	constructor(props){
		super(props);
		
		this.state = {
			onDelete : false,
			rooms : [],
			searchNameTerm: '',
			searchPaymentStatusTerm: '',
			pageOfItems: []
		};

		this.onChangePage = this.onChangePage.bind(this);
	}

	renderOptions(houseid, room , index) {

		if (this.props.ownerShip) {
			return (
				<div className="option-gr">
					<div className="option-gr footer col-sm-4">
						<Link className="option-gr btn btn-lg btn-block btn-info" to={`/houses/details/${houseid}/room/${room._id}`} >Chi Tiết</Link>
					</div>
					<div className="footer col-sm-4">
						<Link className="option-gr btn btn-lg btn-block btn-primary" to={`/houses/edit/${houseid}/${room._id}`} >Sửa</Link>
					</div>
					<div className="footer col-sm-4">
						<a className="option-gr btn btn-lg btn-block btn-danger" onClick={!this.state.onDelete ? this.removeRoom.bind(this, room._id , room.roomName, index) : null}>Xóa</a>
					</div>
				</div>
			)
		}
	}

	onChangePage(pageOfItems) {        
        this.setState({ pageOfItems: pageOfItems });
    }

	renderRooms(){
		const {pageOfItems} = this.state;
		const {houseid} = this.props.match.params;		

		if( pageOfItems.length === 0 ) {
			return (<div className="text-danger text-center">Chưa có phòng nào được tạo. Vui lòng thêm phòng !</div>);
		}

		return _.map(pageOfItems, (room,index) => {
			const panelClass = room.totalRenter !== 0 ? 'panel panel-success panel-pricing' : 'panel panel-empty panel-pricing';
			const payOrNotClass = !room.payment && room.totalRenter !==0 ? 'panel panel-danger panel-pricing' : panelClass;
			return (
				<div className="col-sm-12 text center" key={room._id}>
					<div className={payOrNotClass}>
						<div className="panel-heading">
							<i className="fa fa-user-circle"></i>
							<h4>Phòng: {room.roomName} | Giá: {room.roomPrice} ₫ | {room.totalRenter !== 0 ? "Số Người: " + room.totalRenter : "Phòng Trống"} {room.area ? "| Diện Tích: " + room.area +"	m²": ''} </h4> 
						</div>
						<div className="panel-body text-center">
							<p><strong>Tỉ Giá Điện (₫/kWh): {room.elecRate}  | Tỉ Giá Nước (₫/m3): {room.waterRate} </strong></p>
						</div>
						<ul className="list-group text-center">
							<li className="list-group-item"><i className="fa fa-check"></i>Ghi chú( Số Điện Nước Lúc Vào ): {room.note}</li>
						</ul>											
					</div>
						{this.renderOptions(houseid, room, index)}	
				</div>
			);
		});
	}

	componentWillMount() {
		this.props.currentTab('houseDetails');
		this.props.fetchRooms(this.props.match.params.houseid);
		this.props.checkOwnerShip(this.props.match.params.houseid);
	}

	componentWillUnmount() {
    	this.props.resetPostState()
  	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.rooms !=this.props.rooms) {
			this.setState({
				rooms: 	_.orderBy(nextProps.rooms, ['roomName'], ['asc', 'desc'])		
			})
		}
	}

	removeRoom(roomid, name, index) {
		const{houseid} = this.props.match.params;

		if(confirm('Delete room: '+ name)){
			this.setState({ onDelete:true });
			this.props.deleteRoom(houseid, roomid, () => {
				this.setState({ onDelete:false});
			},
				()=> {
					this.setState({rooms: update(this.state.rooms, {$splice: [[index,1]]})})
			})
		}
	}

	searchByPaymentStatus(value) {

		this.setState({searchPaymentStatusTerm: value})		
		const status = value === "true";

		if(value === 'all' && this.state.rooms !== this.props.rooms) {					
			return this.setState({rooms: _.orderBy(this.props.rooms, ['roomName'], ['asc', 'desc'])})
		}	
		
		if(value === "true" || value === "false") {
			return this.setState({ rooms: _.orderBy(_.filter(this.props.rooms, (data) => { return data.payment === status  && data.totalRenter > 0}), ['roomName'], ['asc', 'desc'])});
		}
		
		if(value === "0") {			
			return this.setState({ rooms: _.orderBy(_.filter(this.props.rooms, {'totalRenter': 0}), ['roomName'], ['asc', 'desc'])})
		}
	}

	searchByRoomName(value) {
		
		this.setState({searchNameTerm: value})

		if(value === '' && this.state.rooms !== this.props.rooms) {

			return this.setState({rooms: _.orderBy(this.props.rooms, ['roomName'], ['asc', 'desc'])})
		}

		return this.setState({ rooms: _.filter(this.props.rooms, {'roomName': value})})

	}		

	render() {
		return (
			<div>
				<h3 className="text-info form-text">Danh Sách Phòng:</h3>
				<hr/>
				<div className="search-group-container">
					<div className="row">
						<div className="search-options">							
							<input type="text" className="search-name col-md-6" value={this.state.searchNameTerm} onChange={event => this.searchByRoomName(event.target.value)} placeholder="Tìm Theo Tên Phòng ..."/>
							<select className="search-payment col-md-2" value={this.state.searchPaymentStatusTerm} onChange={event => this.searchByPaymentStatus(event.target.value)}>
								<option value="all">Tất Cả</option>
								<option value={false}>Chưa Thanh Toán</option>
								<option value={true}>Đã Thanh Toán</option>
								<option value={0}>Phòng Trống</option>
							</select>
						</div>
					</div>
				</div>
				{this.renderRooms()}
				<Pagination items={this.state.rooms} onChangePage={this.onChangePage} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		rooms: state.house.rooms,
		ownerShip: state.house.ownerShip
	}
}

export default connect(mapStateToProps, actions)(HouseDetails);