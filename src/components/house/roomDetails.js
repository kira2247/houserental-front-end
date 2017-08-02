import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import ReactTable from 'react-table';
import update from 'react-addons-update';
import {CSVLink, CSVDownload} from 'react-csv';
import {Carousel} from 'react-responsive-carousel';

class roomDetails extends Component {

	constructor(props){
		super(props);
		
		this.state = {
			onDelete : false,
			records : [],
			renters: [],
		};
	}

	renderImages(cidImages) {

		const settings = {
			showArrows: true,
			showThumbs: false,
			dynamicHeight: true,
			width: "360px",
			infiniteLoop: true,
			useKeyboardArrows: true,
			className: 'image-render-child'
		}

		if(cidImages.length === 0) {			
			return <div className="text-info">(Không Có Hình Ảnh Đính Kèm)</div>
		}	

		return (
			<div className= "image-render">
				<Carousel {...settings}>
					{_.map(cidImages, image => <div className="renter-image" key={image._id}>
													<img src={image.url}></img>													
												</div>)}				
				</Carousel>
			</div>
		)
	}

	renderRenters() {
		const {houseid,roomid} = this.props.match.params;
		

		if( this.state.renters.length === 0) {
			return (<div className="text-danger text-center">Phòng Này Hiện Tại Đang Trống!</div>);
		}
		
		return _.map(this.state.renters, (renter, index) => {
				return (
					<div className="renter" key={index}>
						<div className="container" key={`accordion${index}`}>
							<div className="panel-group" id={`accordion${index}`}>
							    <div className="panel panel-default">
							        <div className="panel-heading">
							        	<h5 className="panel-title">
							            	<a className="accordion-toggle" data-toggle="collapse" data-parent={`accordion${index}`} href={`#renter${index}`}>{renter.fullName}</a>
							            </h5>
							            <div className="config">
							            	<Link className="material-button material-button-toggle" to={`/houses/edit/${houseid}/room/${roomid}/renter/${renter._id}`}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Link>
							            	<a onClick={!this.state.onDelete ? this.removeRenter.bind(this, renter._id , renter.fullName, index) : null}><i className="fa fa-times" aria-hidden="true"></i></a>
							            </div>
							        </div>
							        <div id={`renter${index}`} className="panel-collapse collapse">
							            <div className="panel-body">
							            	Số CMND : {renter.cidNum}
							            </div>
							            <div className="panel-body">
							            	Ngày Tháng Năm Sinh : {moment(renter.dob).format("DD-MM-YYYY")}
							            </div>
							            <div className="panel-body">
							            	Quê Quán : {renter.homeTown}
							            </div>
							            <div className="panel-body">
							            	Ngày Vào Ở : {moment(renter.startRentingDate).format("DD-MM-YYYY")}
							            </div>
							            <div className="panel-body">
							            	Hình Ảnh Đính Kèm : 							            	
							            	{this.renderImages(renter.cidImages)}							            	
							            </div>
							        </div>
							    </div>
							</div>
						</div>
					</div>
				);
			});
	}

	removeRecord(recordid, index){
		const {houseid,roomid} = this.props.match.params
		
		if(confirm('Delete this record')){
			this.setState({ onDelete:true });
			this.props.deleteRecord(houseid, roomid, recordid, () => {
				this.setState({ onDelete:false});
			},
				()=> {
					this.setState({records: update(this.state.records, {$splice: [[index,1]]})})
			})
		}
	}

	removeRenter(renterid, renterName, index) {
		const {houseid,roomid} = this.props.match.params

		if(confirm('Delete renter '+ renterName)){
			this.setState({ onDelete:true });
			this.props.deleteRenter(houseid, roomid, renterid, () => {
				this.setState({ onDelete:false});
			},
				()=> {
					this.setState({renters: update(this.state.renters, {$splice: [[index,1]]})})
			})
		}
	}

	renderRecords() {
		const {houseid,roomid} = this.props.match.params;

		const columns =[{
			Header:'STT',
			sortable: false,
			width: 100,
			Cell: props => props.index+1
		}, {
			id: 'date',
			Header:'Ngày/Tháng/Năm',
			filterable:true,
			accessor: d => moment(d.paymentTime).format("DD-MM-YYYY")
		}, {
			id: 'total',
			Header: 'Tổng Tiền',
			accessor: d => d.total.toLocaleString('vn-VN', {style: 'currency', currency: 'VND'}),
			sortable: false
		}, {
			Header:'Ghi Chú',
			accessor: 'note',
			sortable: false,
			style: {overflow: 'visible',
					wordBreak: 'keep-all',
					whiteSpace: 'normal'}
		}, {
			Header: 'Sửa',
			accessor: '_id',
			sortable: false,
			width: 100,
			Cell: props => <Link className="material-button material-button-toggle" to={`/houses/edit/${houseid}/room/${roomid}/record/${props.value}`}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Link>
		},{
			Header: 'Xóa',
			accessor: '_id',
			indexKey: '_index',
			className: 'removeCell',
			sortable: false,
			width: 100,
			Cell: props => <a onClick={!this.state.onDelete ? this.removeRecord.bind(this,props.value, props.index) : null}><i className="fa fa-times" aria-hidden="true"></i></a>
		}]
	

		return (	
			<ReactTable
			    data={this.state.records}
			    columns={columns}
			    defaultPageSize={5}
			    className= '-striped -highlight'
			    noDataText= {'Chưa có bản ghi nào!'}
			    pageText ={'Trang'}
			    ofText = {'Trong'}
			    rowsText= {'Bản Ghi'}
			    previousText={'Trước'}
 				nextText={'Sau'}				
 				defaultSorted={[{
 					id: 'date',
 					desc: true
 				}]}
			/>
		);
	}

	formatCsvData(records) {
		let data = [];

		_.map(records, (record,i) => {
			data.push({	
						'STT': i+1,
						'Ngày/Tháng/Năm': moment(record.paymentTime).format("DD-MM-YYYY"),
						'Tổng Tiền': record.total.toLocaleString('vn-VN', {style: 'currency', currency: 'VND'}),
						'Ghi chú': record.note,
						'Số Điện Dùng': record.usedElecNum,
						'Số Nước Dùng': record.usedWaterNum,
 						'Giá Phòng': record.roomPrice,
 						'Chi Khác' : record.otherPayment
			})
		})

		return data;
	}

	componentWillMount() {
		const {houseid, roomid} = this.props.match.params;

		this.props.currentTab('roomDetails');
		this.props.checkOwnerShip(houseid, true)
		this.props.fetchRoomDetails(houseid, roomid);
	}

	componentWillUnmount() {
    	this.props.resetPostState()
  	}

	componentWillReceiveProps(nextProps) {
		
		if (nextProps.room !=this.props.room) {
			this.setState({
				records: nextProps.room.records,
				renters: nextProps.room.renters
			})
		}
	}

	render() {
		const {room} = this.props;
		
		if(typeof room === 'undefined') {
			return <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
		}
		
		const csvData = this.formatCsvData(this.state.records);

		return (
			<div>
				<h2 className="text-success text-center form-text">Phòng: {room.roomName}</h2>
				<h3 className="text-success text-center form-text">(Ghi chú: {room.records[room.records.length-1]? room.records[room.records.length-1].note: 'Chưa có bản ghi nào'})</h3>
				<h3 className="text-info form-text">Danh Sách Người Thuê:</h3>
				<hr/>
				{this.renderRenters()}
				<hr/>
				<h3 className="text-info form-text">Bảng Sao Lưu Tiền Phòng:</h3>
				<div className="record-group">
					<Link className="record-group btn btn-primary" to={`/houses/details/${this.props.match.params.houseid}/room/${this.props.match.params.roomid}/add/record`}>Tính Tiền</Link>
					<CSVLink data={csvData} filename={`${room.roomName}.csv`} className="record-group btn btn-success">Xuất File CSV</CSVLink>
				</div>
				{this.renderRecords()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		room: state.house.room
	}
}

export default connect(mapStateToProps, actions )(roomDetails);