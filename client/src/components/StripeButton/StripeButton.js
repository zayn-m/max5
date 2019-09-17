import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { clearCart } from '../../store/actions/cart';
import axios from 'axios';

import StripeCheckout from 'react-stripe-checkout';
import { createOrder } from '../../firebase/firebaseUtils';

const stripeCheckoutButton = ({
	price,
	userData,
	region,
	country,
	currentUser,
	cartItems,
	clearCart,
	done,
	history
}) => {
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
					const data = {
						...userData,
						region: region,
						country: country
					};
					createOrder(data, token, cartItems).then((res) => {
						history.push({
							pathname: '/payment-success',
							state: {
								order: res.orderNo
							}
						});

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
			label="Stripe"
			name="MAX 5"
			email={currentUser ? currentUser.email : ''}
			billingAddress={false}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(stripeCheckoutButton));
