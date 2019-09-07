import React, { Component } from 'react';

import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth, firestore, createUserProfileDocument, createUserCart } from './firebase/firebaseUtils';
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
import PurchaseHistory from './pages/purchaseHistory/PurchaseHistory';
import Admin from './pages/admin/Admin';

class App extends Component {
	state = {
		categories: []
	};

	unsubscribeFromAuth = null;
	unsubscribeFromCategories = null;

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

		this.unsubscribeFromCategories = firestore.collection('products').onSnapshot(async (s) => {
			const categoryCollections = [];
			s.docs.map((d) => categoryCollections.push(d.data().title));
			this.setState({ categories: categoryCollections });
		});
	}

	componentWillUnmount() {
		this.unsubscribeFromAuth();
		this.unsubscribeFromCategories();
	}

	render() {
		return (
			<div className="container-fluid p-0">
				<Navbar match={this.props} categories={this.state.categories} />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/admin" component={Admin} />
					<Route path="/checkout" component={Checkout} />
					<Route exact path="/shop" component={Shop} />
					<Route path="/shop/:category/:productId" component={ProductDetail} />
					<Route
						path="/account"
						render={() => (this.props.currentUser ? <Redirect to="/" /> : <Account />)}
					/>
					<Route
						path="/user/purchase-history"
						render={() => (!this.props.currentUser ? <Redirect to="/" /> : <PurchaseHistory />)}
					/>
					<Route path="/:category/:subCategory" component={Shop} />
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
