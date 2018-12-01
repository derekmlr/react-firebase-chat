import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import firebase from './config/firebase';
import { setUser, clearUser } from './actions';

import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Spinner from './components/Shared/Spinner';

import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';
import rootReducer from './reducers';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
	componentDidMount() {
		// Redirect user to "/" if authenticated
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				// User logged in, go to app
				this.props.setUser(user);
				this.props.history.push('/');
			} else {
				// Guest or logged out, go to /login
				this.props.history.push('/login');
				this.props.clearUser();
			}
		})
	}

	render() {
		return this.props.isLoading ? <Spinner /> : (
			<Switch>
				<Route exact path="/" component={App} />
				<Route path="/login" component={Login} />
				<Route path="/signup" component={Register} />
			</Switch>
		)
	}
}

const mapStateToProps = (state) => {
	return { isLoading: state.user.isLoading }
}

const RootWithRouter = withRouter(
	connect(
		mapStateToProps, 
		{ setUser, clearUser }
	)(Root)	
);

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<RootWithRouter />
		</Router>
	</Provider>, document.getElementById('root'));
serviceWorker.unregister();