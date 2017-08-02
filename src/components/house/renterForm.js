import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import momentLocaliser from 'react-widgets/lib/localizers/moment';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import update from 'react-addons-update';
import $ from 'jquery';
import {Carousel} from 'react-responsive-carousel';

momentLocaliser(moment)

class renterForm extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			cidImages : []
		};
	}
	
	renderField(field){
		const {meta: {touched, error}, className, label, placeholder, input, type} = field;
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

	renderDateTimePicker(field){
		const { label, input: { onChange, value }, showTime , meta: {touched, error}, placeholder} = field;
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
					<div className="text-danger">
						{touched ? error : ''}
					</div>
				</div>
			</div>
		);
	}

	renderEditImageArea() {

		const {cidImages} = this.state;

		const settings = {
			showArrows: true,
			showThumbs: false,
			dynamicHeight: true,
			width: "360px",
			infiniteLoop: true,
			useKeyboardArrows: true,
			className: 'image-render-child'
		}

		if(cidImages.length !== 0) {			
			return (
				<div className= "image-render">
					<Carousel {...settings} >
						{_.map(cidImages, (image,i) => <div className="img-wrap" key={image._id}>
														<span id={`xbtn-${i}`} className="close" onClick={this.removeImage.bind(this, image._id, i)}>&times;</span>
					    								<img src={image.url} data-id={image._id}></img>												
													</div>)}				
					</Carousel>
				</div>
			)
		}		
	}

	componentWillReceiveProps(nextProps) {
		const {renterid} = this.props.match.params;
				
		if(renterid){
			if (nextProps.initialValues!==this.props.initialValues) {
				this.setState({
					cidImages: nextProps.initialValues.cidImages
				})
			}
		}
	}

	removeImage(publicId, i) {
		
		const {houseid, renterid, roomid}= this.props.match.params;
		$(`span#xbtn-${i}`).prop('hidden','true');

		this.props.deleteImage(publicId, houseid, roomid, renterid, () => {
			this.setState({
				cidImages: update(this.state.cidImages, {$splice: [[i,1]]})
			})
		}, () => {
			$(`span#xbtn-${i}`).prop('hidden','false');
		});
	}

	renderDropZone(field){
		const { label, input: { onChange, value }, showTime , meta: {touched, error}} = field;
		const classNameMain = `col-xs-8 form-group ${touched && error? 'has-danger': ''}`;
		const files = value;
		
		return (
			<div className="form-row">
	    		<div className={classNameMain}>
	    			<label className="control-label form-text">{label}</label>
		      		<Dropzone
						name={name}
		        		onDrop={( filesToUpload, e ) => onChange(filesToUpload)}
		      		>
		        		<div className="dropzone"><strong>Kéo Thả Hoặc Nhấn Vào Để Thêm Hình.</strong></div>
		      		</Dropzone>
		      		<div className="text-danger">
						{touched ? error : ''}
					</div>
		      		{files && _.isArray(files) && _.map(files, (file, i) => file.size ? <li key={i}>{file.name}</li>: '')}
	    		</div>
    		</div>
  		);
	}

	componentWillMount() {
		const {houseid, roomid, renterid} = this.props.match.params;

		this.props.currentTab('renterForm');		

		this.props.checkOwnerShip(houseid, true);

		if(renterid) {
			this.props.fetchRenterDetailsForm(houseid, roomid, renterid)
		}
	}

	componentWillUnmount() {
    	this.props.resetPostState()
  	}
	
	handleFormSubmit(values){

		const {roomid,houseid,renterid} = this.props.match.params;
		
		if(renterid){
			return new Promise(resolve => {
				return this.props.updateRenterInfo(houseid, roomid, renterid, values, resolve);
			});
		} else {
			return new Promise(resolve => {
				return this.props.createRenter(houseid, roomid, values, resolve);
			});
		}		
	}
 	
	render() {
		const {handleSubmit,pristine,submitting,reset} = this.props;
		
		return (
			<form className="house-form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} >
				<fieldset className="house-form">
					<legend className="room-form form-text">Form Thêm Người Ở Trọ</legend>
					<Field
						label="Họ Và Tên"
						name="fullName"
						type="text"
						className="input-md form-control"
						placeholder="Họ và tên người thuê"
						component={this.renderField}
					/>
					<Field
						label="Số CMND"
						name="cidNum"
						type="text"
						className="input-md form-control"
						placeholder="Số CMND người thuê"
						component={this.renderField}
					/>
					<Field
						label="Ngày Tháng Năm Sinh"
						name="dob"
						showTime={false}
						placeholder="MM/DD/YYYY"
						component={this.renderDateTimePicker}
					/>
					<Field
						label="Quê Quán"
						name="homeTown"
						type="text"
						className="input-md form-control"
						placeholder="Quê Quán Người Thuê"
						component={this.renderField}
					/>
					<Field
						label="Ngày Vào Ở"
						name="startRentingDate"
						showTime={false}
						placeholder={"MM/DD/YYYY (Để Trống Mặc Định Thời Gian Hiện Tại!)"}
						component={this.renderDateTimePicker}
					/>
					<Field
						label="Hình Ảnh Đính Kèm (CMND, Hộ Khẩu,...)"
						name="cidImages"
						className="input-md form-control"
						component={this.renderDropZone}
					/>
					{this.renderEditImageArea()}
					<div className="col-xs-8 form-options">
						<button id="submit-btn" action="submit" className="form-options btn btn-primary" disabled={submitting} >Submit</button>
						<button className="form-options btn btn-danger" disabled={pristine||submitting} onClick={reset}>Reset</button>
						<Link to={`/houses/details/${this.props.match.params.houseid}/room/${this.props.match.params.roomid}`} className="form-options text-info btn btn-success">Cancel</Link>
					</div>
				</fieldset>
			</form>
		);
	}
}

function validate (values) {
	const errors = {};

	if(!values.fullName || values.fullName.trim() === '') {
		errors.fullName = 'Vui Lòng Không Để Trống Tên!';
	}

	if(!values.cidNum || values.cidNum.trim() === '') {
		errors.cidNum = 'Vui Lòng Không Để Trống Số CMND!';
	}

	if(!values.dob ) {
		errors.dob = 'Vui Lòng Nhập Ngày Tháng Năm Sinh!';
	}

	if(!values.homeTown || values.homeTown.trim() === '') {
		errors.homeTown = 'Vui Lòng Cung Cấp Quê Quán!';
	}
	
	return errors;

}

function mapStateToProps(state) {
	return {
		errorMessage: state.house.errorMessage,
		initialValues: state.house.formDetails,
		ownerShip: state.house.ownerShip
	}
}

let myForm = reduxForm({
	form: 'renterForm',
	validate,
	enableReinitialize: true
})(renterForm)

export default connect(mapStateToProps, actions)(myForm)
