import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../actions';

class createRForm extends Component {

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
		this.props.currentTab('createRForm');
	}

	handleFormSubmit(id, values) {
		this.props.createRoom(id, values);
	}

	render() {
		const {handleSubmit} = this.props;
		return (
			<form className="house-form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this, this.props.match.params.houseid))}>
				<fieldset className="house-form">
					<legend className="room-form">Form Tạo Phòng Cho Thuê</legend>
					<Field
						label="Tên Phòng"
						name="roomName"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Giá Phòng"
						name="roomPrice"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Tỉ Giá Điện (vnd/kWh)"
						name="elecRate"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Tỉ Giá Nước (vnd/m3)"
						name="waterRate"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Ghi chú"
						name="note"
						type="text"
						component={this.renderField}
					/>

					<button action="submit" className="btn btn-primary">Submit</button>
				</fieldset>
			</form>

		)
	}
}

export default reduxForm({
	form: 'createRForm'
})(
	connect(null, actions)(createRForm)
);