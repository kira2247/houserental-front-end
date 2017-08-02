import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocaliser from 'react-widgets/lib/localizers/moment';
import * as actions from '../../actions';
import { Link } from 'react-router-dom';


momentLocaliser(moment)

class createRecordForm extends Component{

	renderField(field){
		const {meta: {touched, error}, className, label, placeholder, input, type} = field;
		const classNameMain = `col-xs-8 form-group ${touched && error? 'has-danger': ''}`;
		return (
			<div className="form-row">
				<div className= {classNameMain}>
					<label className="control-label form-text">{label}</label>
					<input 
							autoComplete="off"
							className={className}
							type={type}
							{...input}
							placeholder={placeholder}
					/>
					<div className="text-danger">
						{touched ? error : ''}
					</div>
				</div>
			</div>
		);
	}

	renderDateTimePicker(field){
		const { label, input: { onChange, value },meta: {touched, error}, showTime, placeholder } = field;
		const classNameMain = `col-xs-8 form-group ${touched && error? 'has-danger': ''}`;

		return(
			<div className="form-row">
				<div className= {classNameMain}>
					<label className="control-label form-text">{label}</label>
					<DateTimePicker className="date-picker"
						onChange={onChange}
						time={showTime}
						value={value ? new Date(value) : null}
						placeholder={placeholder}
					/>
				</div>
			</div>
		);
	}

	handleFormSubmit(values){
		const {roomid,houseid,recordid} = this.props.match.params;
		
		if(recordid){
			return new Promise(resolve => {
				return this.props.updateRecordInfo(houseid, roomid, recordid, values, resolve);
			});
		} else {
			return new Promise(resolve => {
				return this.props.createRecord(houseid, roomid, values, resolve);
			});
		}
	}

	componentWillMount() {

		const {roomid,houseid,recordid} = this.props.match.params;
		this.props.currentTab('createRecordForm');
		this.props.checkOwnerShip(houseid, true)
		this.props.fetchRoomDetails(houseid,roomid);
		
		if(recordid){
			this.props.fetchRecordDetailsForm(houseid, roomid, recordid);
		}

	}

	componentWillUnmount() {
    	this.props.resetPostState()
  	}

	render() {
		const {handleSubmit, submitting, reset, pristine, room} = this.props;
		const number = value => value && _.parseInt(value)
		
		return (
			<form className="house-form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} >
				<fieldset className="house-form">
					<legend className="house-form form-text">Form Tính Tiền Phòng {room.roomName}</legend>
					<Field
						label="Ngày Tháng"
						name="paymentTime"
						showTime={false}
						placeholder={"MM/DD/YYYY (Để Trống Mặc Định Thời Gian Hiện Tại!)"}
						component={this.renderDateTimePicker}
					/>
					<Field
						label="Tiền Phòng"
						name="roomPrice"
						type="text"
						parse={number}
						className="input-md form-control"
						placeholder={room.roomPrice + "đ"}
						component={this.renderField}
					/>
					<Field
						label="Số Điện Đã Dùng"
						name="usedElecNum"
						type="number"
						parse={number}
						className="input-md form-control"
						placeholder={"x "+ room.elecRate+"đ/kWH"}
						component={this.renderField}
					/>
					<Field
						label="Số Nước Đã Dùng"
						name="usedWaterNum"
						type="number"
						parse={number}
						className="input-md form-control"
						placeholder= {"x "+ room.elecRate+"đ/Khối"}
						component={this.renderField}
					/>
					<Field
						label="Thu khác"
						name="otherPayment"
						type="number"
						parse={number}
						className="input-md form-control"
						placeholder="Internet, các chi phí phát sinh khác, ..."
						component={this.renderField}
					/>
					<Field
						label="Ghi chú"
						name="note"
						type="text"
						className="input-md form-control"
						placeholder="Số điện nước, các nguồn phát sinh"
						component={this.renderField}
					/>
					<div className="col-xs-8 form-row form-options">
						<button id="submit-btn" action="submit" className="form-options btn btn-primary" disabled={submitting} >Submit</button>
						<button className="form-options btn btn-danger" disabled={pristine||submitting} onClick={reset}>Reset</button>
						<Link to={`/houses/details/${this.props.match.params.houseid}/room/${this.props.match.params.roomid}`} className="form-options text-info btn btn-success">Cancel</Link>
					</div>
				</fieldset>
			</form>
		);
	}
}

createRecordForm.defaultProps = {
	room: []
};

function validate (values) {
	const errors = {};

	if(!values.roomPrice) {
		errors.roomPrice = 'Vui Lòng Không Để Trống Giá Phòng!';
	}

	if(!values.usedElecNum ) {
		errors.usedElecNum = 'Vui Lòng Không Để Trống Số Điện!';
	}

	if(!values.usedWaterNum ) {
		errors.usedWaterNum = 'Vui Lòng Không Để Trống Số Nước!';
	}

	if(!values.note || values.note.trim() === '') {
		errors.note = 'Vui Lòng Ghi Chú Số Điện & Nước Hiện Tại!';
	}
	
	return errors;
}

function mapStateToProps(state) {
	return{
		room : state.house.room,
		errorMessage: state.house.errorMessage,
		initialValues: state.house.formDetails,
		ownerShip: state.house.ownerShip
	}
}

let myForm = reduxForm({
	enableReinitialize: true,
	form: 'createRecordForm',
	validate
})(createRecordForm)

export default connect(mapStateToProps,actions)(myForm);

