import React, {Component} from 'react'
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {signinUser, resetPostState} from '../../actions/auth';
import {RESET_POST_STATE} from '../../actions/types';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';


class SignIn extends Component {
	
	renderField(field) {

		const {meta: {touched, error}, label, placeholder, type, input} = field;
		const className = `form-group ${touched && error? 'has-danger': ''}`;
		return (
			<div className= {className}>
				<label>{label}</label>
				<input 
						id="authenticate-form"
						autoComplete="off"
						className= "form-control"
						type={type}
						{...input}
						placeholder={placeholder}
				/>
				<div className="text-danger">
					{touched ? error : ''}
				</div>
			</div>
			
		);
	}

	handleFormSubmit({email, password}){
		this.props.signinUser({email, password})
	}

	componentWillUnmount() {
    	this.props.resetPostState();
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
	
	renderModal() {
		const {handleSubmit, submitting, reset, pristine } = this.props;
		
		const customStyles = {
			content : {			
			    border: '0',
		        borderRadius: '4px',
		        bottom: 'auto',
		        minHeight: '10rem',
		        left: '50%',
		        padding: '2rem',
		        position: 'fixed',
		        right: 'auto',
		        top: '50%',
		        transform: 'translate(-50%,-50%)',
		        minWidth: '20rem',
		        width: '80%',
		        maxWidth: '60rem'
			}
		};

		return (
			<div>
				<Modal
					isOpen={this.props.isOpenSignUp}
					onRequestClose={this.props.isClose}
					contentLabel="SignIn Modal"
					style={customStyles}				
				>
					<form className="house-form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
						<fieldset className="house-form">
							<legend className="house-form">Đăng Nhập</legend>
							<Field
								label="Địa Chỉ Email *"
								name="email"
								type="text"
								placeholder="Địa chỉ email"						
								component={this.renderField}
							/>
							<Field
								label="Mật Khẩu *"
								name="password"
								type="password"
								placeholder="Mật Khẩu"
								component={this.renderField}
							/>
							{this.renderAlert()}														
							<div className="form-options">
								<button id="submit-btn" action="submit" className="form-options btn btn-primary" disabled={submitting} >Đăng Nhập</button>
								<button className="form-options btn btn-danger" disabled={pristine||submitting} onClick={reset}>Reset</button>
							</div>
						</fieldset>
					</form>
				</Modal>
			</div>
		)	
	}

	render() {
		return (
			<div>
				{this.renderModal()}
			</div>
		)
	}
}

function validate (values) {
	const errors = {};


	if(!values.email || values.email.trim() === '') {
		errors.email = 'This field is required, please enter email!';
	}

	if(!values.password || values.password.trim() === '') {
		errors.password = 'This field is required, please enter password!';
	}

	if(values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid email';
	}

	return errors;
}

function mapStateToProps(state) {
	return {
		errorMessage: state.auth.errorMessage,
	}
}


let myForm = reduxForm({
	form: 'signin',
	validate
})(SignIn)

export default connect(mapStateToProps,{signinUser,resetPostState})(myForm)
