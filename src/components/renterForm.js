import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../actions';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocaliser from 'react-widgets/lib/localizers/moment';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

momentLocaliser(moment)

class renterForm extends Component {
	
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

	renderDateTimePicker(field){
		const { label, input: { onChange, value }, showTime } = field;

		return(
			<div>
				<label>{label}</label>
				<DateTimePicker className="date-picker"
					onChange={onChange}
					time={showTime}
					defaultValue= {null}
				/>
			</div>
		);
	}

	renderDropZone(field){
		const files = field.input.value;
		console.log(field);
		return (
    		<div>
    			<label>{field.label}</label>
	      		<Dropzone
	        		name={field.name}
	        		onDrop={( filesToUpload, e ) => field.input.onChange(filesToUpload)}
	      		>
	        		<div>Try dropping some files here, or click to select files to upload.</div>
	      		</Dropzone>
	      		{field.meta.touched && field.meta.error && <span className="error">{field.meta.error}</span>}
	      		{files && _.isArray(files) && _.map(files, (file, i) => <img src={file.preview} key={i}/>)}
    		</div>
    		
  		);
	}
	
	handleFormSubmit(values){
		console.log(values);
		this.props.uploadImage(values);
	}
 	
	render() {
		const {handleSubmit} = this.props;
		return (
			<form className="house-form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
				<fieldset className="house-form">
					<legend className="room-form">Form Thêm Người Ở Trọ</legend>
					<Field
						label="Họ Và Tên"
						name="fullName"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Số CMND"
						name="cidNum"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Ngày Tháng Năm Sinh"
						name="dob"
						type="text"
						component={this.renderDateTimePicker}
					/>
					<Field
						label="Quê Quán"
						name="homeTown"
						type="text"
						component={this.renderField}
					/>
					<Field
						label="Ngày Vào Ở"
						name="startRentingDate"
						showTime={true}
						component={this.renderDateTimePicker}
					/>
					<Field
						label="Hình Ảnh Đính Kèm (CMND, Hộ Khẩu,...)"
						name="cidImages"
						component={this.renderDropZone}
					/>
					
					<button action="submit" className="btn btn-primary">Submit</button>
				</fieldset>
			</form>
		);
	}
}

export default reduxForm({
	form: 'renterForm',
})(
	connect(null, actions)(renterForm)
);