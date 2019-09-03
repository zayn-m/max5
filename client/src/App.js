import React, { Component } from 'react';

import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth, createUserProfileDocument, createUserCart } from './firebase/firebaseUtils';
import { connect } from 'react-redux';
import { setCurrentUser } from './store/actions/user';
import { selectCurrentUser } from './store/selectors/user';
import { selectCartItems } from './store/selectors/cart';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/home/Home';
import Shop from './pages/shop/Shop';
import Account from './pages/account/Account';
import Checkout from './pages/checkout/Checkout';
import ProductDetail from './pages/productDetail/ProductDetail';

class App extends Component {
	unsubscribeFromAuth = null;

	componentDidMount() {
		this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
			if (userAuth) {
				const userRef = await createUserProfileDocument(userAuth);
				userRef.onSnapshot((snapshot) => {
					this.props.setCurrentUser({
						id: snapshot.id,
						...snapshot.data()
					});

					// Initializing cart on auth
					createUserCart({ id: snapshot.id, ...snapshot.data() }, this.props.cartItems);
				});
			} else {
				this.props.setCurrentUser(userAuth);
			}
		});
	}

	componentWillUnmount() {
		this.unsubscribeFromAuth();
	}

	render() {
		return (
			<div className="container-fluid p-0">
				<Navbar match={this.props} />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/checkout" component={Checkout} />
					<Route exact path="/shop" component={Shop} />
					<Route path="/shop/:category/:productId" component={ProductDetail} />
					<Route
						path="/account"
						render={() => (this.props.currentUser ? <Redirect to="/" /> : <Account />)}
					/>
					<Route path="/:category" component={Shop} />
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		currentUser: selectCurrentUser(state),
		cartItems: selectCartItems(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setCurrentUser: (user) => dispatch(setCurrentUser(user))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
