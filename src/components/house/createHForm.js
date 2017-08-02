import React, { Component } from 'react';
import {connect} from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import { Link } from 'react-router-dom';

class createHForm extends Component {

	renderField(field){
		const {meta: {touched, error}, label, placeholder, type, input, className} = field;
		const classNameMain = `col-xs-8 form-group ${touched && error? 'has-danger': ''}`;
		return (
			<div className="form-row">
				<div className= {classNameMain}>
					<label className="control-label form-text" >{label}</label>
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
		const {houseid} = this.props.match.params;

		if(houseid) {
			this.props.checkOwnerShip(houseid, true);	
			this.props.fetchHouseDetailsForm(houseid, true)
		}
	}

	componentWillUnmount() {
    	this.props.resetPostState()
  	}

	handleFormSubmit(values) {
		const {houseid} = this.props.match.params;

		if(houseid){
			return new Promise(resolve => {
				return this.props.updateHouseInfo(houseid, values, resolve);
			});
		} else {
			return new Promise(resolve => {
				return this.props.createHouse(values, resolve);
			});
		}
	}

	renderAlert() {
		if (this.props.errorMessage) {
			return (
				<div className="alert alert-danger">
					<strong>Oops!</strong> {this.props.errorMessage}
				</div>
			)
		}
	}

	render() {
		const {handleSubmit, submitting, reset, pristine } = this.props;
				
		return (
			<form className="house-form form-horizontal" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
				<fieldset className="house-form">
					<legend className="house-form form-text">Form Tạo Nhà Cho Thuê</legend>
					<Field
						label="Họ Và Tên Chủ Nhà *"
						name="ownersName"
						type="text"
						className="input-md form-control"
						placeholder="Họ và tên của chủ nhà"						
						component={this.renderField}
					/>
					<Field
						label="Địa Chỉ *"
						name="address"
						type="text"
						className="input-md form-control"
						placeholder="Địa chỉ nhà cho thuê"
						component={this.renderField}
					/>
					<Field
						label="Số Điện Thoại Liên Hệ *"
						name="phoneNumber"
						type="text"
						className="input-md form-control"
						placeholder="Số điện thoại"
						component={this.renderField}
					/>
					<Field
						label="Đối Tượng Cho Thuê"
						name="rentalTargets"
						type="text"
						className="input-md form-control"
						placeholder="Đối tượng thuê nhà"
						component={this.renderField}
					/>
					<Field
						label="Số Lượng Phòng"
						name="totalRoom"
						type="number"
						className="input-md form-control"
						placeholder="Tổng số phòng"
						component={this.renderField}
					/>			
					{this.renderAlert()}		
					<div className="col-xs-8 form-row form-options">
						<button id="submit-btn" action="submit" className="form-options btn btn-primary" disabled={submitting} >Submit</button>
						<button className="form-options btn btn-danger" disabled={pristine||submitting} onClick={reset}>Reset</button>
						<Link to="/houses" className="form-options text-info btn btn-success">Cancel</Link>
					</div>
				</fieldset>
			</form>
		);
	}
}

function validate (values) {
	const errors = {};

	if(!values.ownersName || values.ownersName.trim() === '') {
		errors.ownersName = 'Vui Lòng Không Để Trống Tên Chủ Nhà!';
	}

	if(!values.address || values.address.trim() === '') {
		errors.address = 'Vui Lòng Không Để Trống Địa Chỉ!';
	}

	if(!values.phoneNumber || values.phoneNumber.trim() === '') {
		errors.phoneNumber = 'Vui Lòng Không Để Trống Số Điện Thoại!';
	}
	
	return errors;

}

function mapStateToProps(state) {
	return {
		initialValues: state.house.formDetails,
		errorMessage: state.house.errorMessage
	}
}

let myForm = reduxForm({
	form: 'createHForm',
	validate,
	enableReinitialize: true
})(createHForm)

export default connect(mapStateToProps, actions)(myForm)
