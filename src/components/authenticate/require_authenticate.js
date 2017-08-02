import React, {Component} from 'react';
import { connect } from 'react-redux';
import SignIn from './signin';

export default function(ComposedComponent) {
	class Authentication extends Component {

		constructor () {
		    super();
		    this.state = {		     
		      showSignInModal: false
		    };
  		}
		
		componentWillMount() {
			if (!this.props.authenticated || this.props.authenticated === 'undefined'){
				this.setState({showSignInModal:true})
			}
		}

		componentWillUpdate(nextProps) {
			if (!nextProps.authenticated || nextProps.authenticated === 'undefined') {
				this.setState({showSignInModal:true})
				
			}
		}

		render() {	
			
			if(!this.props.authenticated || this.props.authenticated === 'undefined') {	
				return (
					<SignIn
					isOpenSignUp={(this.state.showSignInModal)}
					isClose={() => window.location.href = '/houses'}
					/>
				)
			}

			return <ComposedComponent {...this.props}/>			
		}
	}

	function mapStateToProps(state){
		return { authenticated: state.auth.authenticated};
	}

	return connect(mapStateToProps)(Authentication);
}