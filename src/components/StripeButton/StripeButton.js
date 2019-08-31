import React from 'react';
import { connect } from 'react-redux';
import { clearCart } from '../../store/actions/cart';

import StripeCheckout from 'react-stripe-checkout';

const stripeCheckoutButton = ({ price, currentUser, clearCart }) => {
	const priceStripe = price * 100;
	const publickey = 'pk_test_tzw0hlS36jQyBNpjmGpqx9v700pPqjEoeo';

	const onToken = (token) => {
		if (token) {
			alert('Payment Successful');
			clearCart(currentUser);
		}
	};

	return (
		<StripeCheckout
			label="Pay Now"
			name="MAX 5"
			billingAddress
			shippingAddress
			description={`Your total is $${price}`}
			amount={priceStripe}
			panelLabel="Pay Now"
			token={onToken}
			stripeKey={publickey}
		/>
	);
};

const mapStateToProps = (state) => ({
	currentUser: state.userReducer.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	clearCart: (currentUser) => dispatch(clearCart(currentUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(stripeCheckoutButton);
