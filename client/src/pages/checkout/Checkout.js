import React from 'react';

import './Checkout.css';
import { selectCartItems, selectCartTotal } from '../../store/selectors/cart';
import { connect } from 'react-redux';
import CheckoutItem from '../../components/CheckoutItem/CheckoutItem';
import StripeCheckoutButton from '../../components/StripeButton/StripeButton';

class Checkout extends React.Component {
	selectProductHandler = (id, category) => {
		this.props.history.push({
			pathname: `/shop/${category}/${id}`
		});
	};

	render() {
		const { cartItems, total, currentUser } = this.props;
		return (
			<div className="checkout-page">
				<div className="checkout-header">
					<div className="header-block">
						<span>Product</span>
					</div>
					<div className="header-block">
						<span>Description</span>
					</div>
					<div className="header-block">
						<span>Quantity</span>
					</div>
					<div className="header-block">
						<span>Price</span>
					</div>
					<div className="header-block">
						<span>Remove</span>
					</div>
				</div>
				{cartItems.map((cartItem) => (
					<CheckoutItem key={cartItem.id} cartItem={cartItem} clicked={this.selectProductHandler} />
				))}
				<div className="total">
					<span>TOTAL: ${total.toFixed(2)}</span>
				</div>
				<div className="test-warning">
					*Please use the following test credit card for test payments*
					<br />
					4242 4242 4242 4242 - Exp: 01/20 - CVV: 123 <br />
					<div className="mt-5 mx-auto text-center">
						{currentUser ? (
							<StripeCheckoutButton price={total} />
						) : (
							<p className="text-danger">Please login to proceed.</p>
						)}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	currentUser: state.userReducer.currentUser,
	cartItems: selectCartItems(state),
	total: selectCartTotal(state)
});

export default connect(mapStateToProps)(Checkout);