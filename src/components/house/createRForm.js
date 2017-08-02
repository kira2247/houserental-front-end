import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError, reset } from 'redux-form';
import * as actions from '../../actions';
import { Link } from 'react-router-dom';
import diff from 'deep-diff';

class createRForm extends Component {

	renderField(field){
		const {meta: {touched, error}, label, placeholder, type, input, className} = field;
		const classNameMain = `col-xs-8 form-group ${touched && error? 'has-danger': ''}`;
		return (
			<div className="form-row">
				<div className= {classNameMain}>
					<label className="control-label form-text">{label}</label>
					<input 
							autoComplete="off"
							className= {className}
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

	componentWillMount() {
		const {houseid,roomid} = this.props.match.params;

		this.props.checkOwnerShip(houseid, true);	

		this.props.currentTab('createRForm');			

		if(roomid) {
			this.props.fetchRoomDetailsForm(houseid, roomid)
		}

	}
	
	componentWillUnmount() {
    	this.props.resetPostState()
  	}

	handleFormSubmit(values) {
		
		const {roomid,houseid} = this.props.match.params;

		if(roomid){
			return new Promise(resolve => {
				return this.props.updateRoomInfo(houseid, roomid, values, resolve);
			});
		} else {
			return new Promise(resolve => {
				return this.props.createRoom(houseid, values, resolve);
			});
		}
	}

	renderAlert() {
		if (this.props.errorMessage) {
			return (
				<div className="col-xs-8 alert alert-danger">
					<strong>Oops!</strong> {this.props.errorMessage}
				</div>
			)
		}
	}

	render() {
		const {handleSubmit, submitting, reset, pristine } = this.props;

		return (
			<form  className="house-form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
				<fieldset className="house-form">
					<legend className="room-form form-text">Form Tạo Phòng Cho Thuê</legend>
					<Field
						label="Tên Phòng *"
						name="roomName"
						type="text"
						className="input-md form-control"
						placeholder="Tên Phòng Cho Thuê"
						component={this.renderField}
					/>
					<Field
						label="Giá Phòng *"
						name="roomPrice"
						type="number"
						className="input-md form-control"
						placeholder="Giá Phòng Cho Thuê"
						component={this.renderField}
					/>
					<Field
						label="Tỉ Giá Điện (vnd/kWh) *"
						name="elecRate"
						type="number"
						className="input-md form-control"
						placeholder="Tỉ giá điện của phòng (dành cho việc tính tiền phòng)"
						component={this.renderField}
					/>
					<Field
						label="Tỉ Giá Nước (vnd/m3) *"
						name="waterRate"
						type="number"
						className="input-md form-control"
						placeholder="Tỉ giá nước của phòng (dành cho việc tính tiền phòng)"
						component={this.renderField}
					/>
					<Field
						label="Diện Tích (m2)"
						name="area"
						type="number"
						className="input-md form-control"
						placeholder="Diện Tích Phòng"
						component={this.renderField}
					/>
					<Field
						label="Ghi chú"
						name="note"
						type="text"
						className="input-md form-control"
						placeholder="Ghi chú số điện nước mới vào, tình trạng phòng,..."
						component={this.renderField}
					/>
					{this.renderAlert()}
					<div className="col-xs-8 form-row form-options">
						<button id="submit-btn" action="submit" className="form-options btn btn-primary" disabled={submitting} >Submit</button>
						<button className="form-options btn btn-danger" disabled={pristine||submitting} onClick={reset}>Reset</button>
						<Link to={`/houses/details/${this.props.match.params.houseid}`} className="form-options text-info btn btn-success">Cancel</Link>
					</div>
				</fieldset>
			</form>

		)
	}
}

function mapStateToProps(state) {
	
	return {
		ownerShip: state.house.ownerShip,
		errorMessage: state.house.errorMessage,
		initialValues: state.house.formDetails		
	}
}

function validate (values) {
	const errors = {};

	if(!values.roomName || values.roomName.trim() === '') {
		errors.roomName = 'Vui Lòng không Để Trống Tên Phòng!';
	}

	if(!values.roomPrice) {
		errors.roomPrice = 'Vui Lòng Không Để Trống Giá Phòng!';
	}

	if(!values.elecRate) {
		errors.elecRate = 'Vui Lòng Không Để Trống Tỉ Giá Điện!';
	}


	if(!values.waterRate) {
		errors.waterRate = 'Vui Lòng Không Để Trống Tỉ Giá Nước!';
	}
	
	return errors;
}

let myForm = reduxForm({
	form: 'createRForm',
	validate,
	enableReinitialize: true
})(createRForm)

export default connect(mapStateToProps, actions)(myForm)
