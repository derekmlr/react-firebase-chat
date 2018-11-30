import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from '../../config/firebase';

class Login extends React.Component {
	state = {
		errors: [],
		loading: false,
		email: '',
		password: ''
	}

	/**
	 * Display errors to user
	 */
	displayErrors = errors => {
		return errors.map((error, i) => <p key={i}>{error.message}</p>);
	}

	/**
	 * Add each input value to state
	 */
	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	}

	/**
	 * Handle submission - Attempt to log in user in Firebase
	 */
	handleSubmit = event => {
		event.preventDefault();
		if(this.isFormValid(this.state)) {
			this.setState({ errors: [], loading: true }); // Reset errors
			firebase.auth()
				.signInWithEmailAndPassword(this.state.email, this.state.password)
				.catch(err => {
					this.setState({ 
						errors: this.state.errors.concat(err), 
						loading: false 
					});
				});
		}
	}

	/**
	 * Make sure both email and password has values
	 */
	isFormValid = ({ email, password }) => {
		return email && password;
	}

	/**
	 * Show error visual on input
	 */
	handleInputErrorVisual = (errors, errorTerm) => {
		// Return true if error message contains an error term
		return errors.some(error => error.message.toLowerCase().includes(errorTerm)) ? 'error' : '';
	}

	render() {
		const { email, password, errors, loading } = this.state;

		return (
			<Grid textAlign="center" verticalAlign="middle" className="App">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h1" icon color="purple" textAlign="center">
						<Icon name="comments" color="purple" />
						Log In to Chat
					</Header>
					{errors.length > 0 && (
						<Message error>
							{this.displayErrors(errors)}
						</Message>
					)}
					<Form onSubmit={this.handleSubmit} size="large">
						<Segment>
							<Form.Input 
								fluid name="email" 
								icon="envelope" 
								iconPosition="left" 
								placeholder="Email Address" 
								onChange={this.handleChange} 
								value={email} 
								className={this.handleInputErrorVisual(errors, 'email')} 
								type="text" 
							/>
							<Form.Input 
								fluid 
								name="password" 
								icon="lock" 
								iconPosition="left" 
								placeholder="Password" 
								onChange={this.handleChange} 
								value={password} 
								className={this.handleInputErrorVisual(errors, 'password')} 
								type="password" 
							/>
							<Button disabled={loading} className={loading ? 'loading' : ''} color="purple" fluid size="large">Log In</Button>
						</Segment>
					</Form>
					<Message>
						Don't have an account? <Link to="/signup">Sign Up</Link>
					</Message>
				</Grid.Column>
			</Grid>
		)
	}
}

export default Login;