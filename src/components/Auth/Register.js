import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import md5 from 'md5';

import firebase from '../../config/firebase';

class Register extends React.Component {
	state = {
		errors: [],
		loading: false,
		displayName : '',
		email: '',
		password: '',
		confirmPassword: '',
		usersRef: firebase.database().ref('users')
	}

	/**
	 * Form validation
	 */
	isFormValid = () => {
		let errors = [];
		let error;

		if(this.isFormEmpty(this.state)) {
			// Form is empty, throw error
			error = { message: 'All fields are required.' };
			this.setState({ errors: errors.concat(error) });
			return false;
		} else if (!this.isPasswordValid(this.state)) {
			// Passwords don't match or are too short, throw error
			error = { message: 'Passwords must match and be more than 6 characters.' };
			this.setState({ errors: errors.concat(error) });
			return false;
		} else {
			// Everything good, continue!
			return true;
		}
	}

	/**
	 * Check if form inputs are empty
	 */
	isFormEmpty = ({ displayName, email, password, confirmPassword }) => {
		return !displayName.length || !email.length || !password.length || !confirmPassword.length;
	}

	/**
	 * Validate password inputs
	 */
	isPasswordValid = ({ password, confirmPassword }) => {
		if (password.length < 6 || confirmPassword.length < 6) {
			// Too short, throw error
			return false;
		} else if (password !== confirmPassword) {
			// Passwords don't match, throw error
			return false;
		} else {
			// Everything good, continue!
			return true;
		}
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
	 * Handle submission - Attempt to register user in Firebase
	 */
	handleSubmit = event => {
		event.preventDefault();
		if(this.isFormValid()) {
			this.setState({ errors: [], loading: true }); // Reset errors
			
			// Register user to Firebase
			firebase.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then(createdUser => {
					// User is created! Add display name and avatar data...
					createdUser.user.updateProfile({
						displayName: this.state.displayName,
						photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
					})
					.then(() => {
						// Saved metadata to user record!
						this.saveUser(createdUser);
					})
					.catch(err => {
						// Couldn't update profile... Throw error
						console.error(err);
						this.setState({ 
							errors: this.state.errors.concat(err), 
							loading: false 
						});
					})
				})
				.catch(err => {
					// User account couldn't be created... Throw error
					console.error(err);
					this.setState({ 
						errors: this.state.errors.concat(err), 
						loading: false 
					});
				});
			}
	}

	/**
	 * Save metadata to user record
	 */
	saveUser = createdUser => {
		return this.state.usersRef.child(createdUser.user.uid).set({
			displayName: createdUser.user.displayName,
			avatar: createdUser.user.photoURL 
		});
	}

	/**
	 * Show error visual on input
	 */
	handleInputErrorVisual = (errors, errorTerm) => {
		// Return true if error message contains an error term
		return errors.some(error => error.message.toLowerCase().includes(errorTerm)) ? 'error' : '';
	}

	render() {
		const { displayName, email, password, confirmPassword, errors, loading } = this.state;

		return (
			<Grid textAlign="center" verticalAlign="middle" className="App">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h1" icon color="orange" textAlign="center">
						<Icon name="comments" color="orange" />
						Sign Up to Chat
					</Header>
					{errors.length > 0 && (
						<Message error>
							{this.displayErrors(errors)}
						</Message>
					)}
					<Form onSubmit={this.handleSubmit} size="large">
						<Segment>
							<Form.Input 
								fluid 
								name="displayName" 
								icon="user" 
								iconPosition="left" 
								placeholder="Display Name" 
								onChange={this.handleChange} 
								value={displayName} 
								type="text" 
							/>
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
							<Form.Input 
								fluid 
								name="confirmPassword" 
								icon="repeat" 
								iconPosition="left" 
								placeholder="Confirm Password" 
								onChange={this.handleChange} 
								value={confirmPassword} 
								className={this.handleInputErrorVisual(errors, 'password')} 
								type="password" 
							/>

							<Button disabled={loading} className={loading ? 'loading' : ''} color="orange" fluid size="large">Create Account</Button>
						</Segment>
					</Form>
					<Message>
						Already got an account? <Link to="/login">Log in</Link>
					</Message>
				</Grid.Column>
			</Grid>
		)
	}
}

export default Register;