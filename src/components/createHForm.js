import React, { Component } from 'react';
import {connect} from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../actions';

class createHForm extends Component {

	renderField(field){
		const {meta: {touched, error}} = field;
		const className = `form-group ${touched && error? 'has-danger': ''}`;
		return (
			<div className= {className}>
				<label>{field.label}</label>
				<input 
						autoComplete="off"
						className= "form-control"
						type={field.type}
						{...field.input}
				/>
				<div className="text-help">
					{touched ? error : ''}
				</div>
			</div>
			
		);
	}

	componentWillMount() {
		this.props.currentTab('createHForm');
	}

	handleFormSubmit(values) {
		this.props.createHouse(values);
	}

	render() {
		const { handleSubmit } = this.props;
		return (
			<form className="house-form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
				<fieldset className="house-form">
					<legend className="house-form">Form Tạo Nhà Cho Thuê</legend>
					<Field
						label="Họ Và Tên Chủ Nhà"
						name="ownersName"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Địa Chỉ"
						name="address"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Số Điện Thoại Liên Hệ"
						name="phoneNumber"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Đối Tượng Cho Thuê"
						name="rentalTargets"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Số Lượng Phòng"
						name="totalRoom"
						type="text"
						component={this.renderField}
					/>
					
					<button action="submit" className="btn btn-primary">Submit</button>
				</fieldset>
			</form>
		);
	}
}

function mapStateToProps(state) {
	return {
		success: state.house.createSuccess,
		message: state.house.message
	}
}

export default reduxForm({
	form: 'createHForm'
})(
	connect(mapStateToProps, actions)(createHForm)
);