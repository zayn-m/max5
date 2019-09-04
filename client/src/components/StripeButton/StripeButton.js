import React from 'react';
import { connect } from 'react-redux';
import { clearCart } from '../../store/actions/cart';
import axios from 'axios';

import StripeCheckout from 'react-stripe-checkout';
import { createOrder } from '../../firebase/firebaseUtils';

const stripeCheckoutButton = ({ price, currentUser, cartItems, clearCart, done }) => {
	const priceStripe = price * 100;
	const publickey = 'pk_test_tzw0hlS36jQyBNpjmGpqx9v700pPqjEoeo';

	const onToken = (token) => {
		if (token) {
			axios({
				url: 'payment',
				method: 'post',
				data: {
					amount: priceStripe,
					token
				}
			})
				.then((res) => {
					// alert('Payment successful');
					console.log('Payment successful');
					createOrder(currentUser, token, cartItems).then(() => {
						done();
						clearCart(currentUser);
					});
				})
				.catch((err) => {
					console.log('Payment error: ', JSON.parse(err));
					alert('There was an issue with your payment. Please provide valid credit card.');
				});
		}
	};

	return (
		<StripeCheckout
			label="Pay Now"
			name="MAX 5"
			email={currentUser ? currentUser.email : ''}
			billingAddress
			shippingAddress={false}
			description={`Your total is $${price.toFixed(2)}`}
			amount={priceStripe}
			panelLabel="Pay Now"
			token={onToken}
			stripeKey={publickey}
			panelLabel="Give Money"
		/>
	);
};

const mapStateToProps = (state) => ({
	currentUser: state.userReducer.currentUser,
	cartItems: state.cartReducer.cartItems
});

const mapDispatchToProps = (dispatch) => ({
	clearCart: (currentUser) => dispatch(clearCart(currentUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(stripeCheckoutButton);
