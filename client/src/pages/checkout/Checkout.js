import React from 'react';

import './Checkout.css';
import { selectCartItems, selectCartTotal } from '../../store/selectors/cart';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutItem from '../../components/CheckoutItem/CheckoutItem';
import StripeCheckoutButton from '../../components/StripeButton/StripeButton';
import BillingForm from '../../components/BillingForm/BillingForm';
import PaymentOptions from '../../components/PaymentOptions/PaymentOptions';
import PaypalButton from '../../components/PaypalButton/PaypalButton';

class Checkout extends React.Component {
	selectProductHandler = (id, category) => {
		this.props.history.push({
			pathname: `/shop/${category}/${id}`
		});
	};

	notify = () => {
		toast('Your order has been placed!');
	};

	render() {
		const { cartItems, total } = this.props;
		return (
			// <div className="checkout-page">
			// 	<ToastContainer autoClose={2000} hideProgressBar={true} style={{ fontWeight: 'bold', color: '#000' }} />
			// 	<div className="checkout-header">
			// 		<div className="header-block">
			// 			<span>Product</span>
			// 		</div>
			// 		<div className="header-block">
			// 			<span>Description</span>
			// 		</div>
			// 		<div className="header-block">
			// 			<span>Quantity</span>
			// 		</div>
			// 		<div className="header-block">
			// 			<span>Price</span>
			// 		</div>
			// 		<div className="header-block">
			// 			<span>Remove</span>
			// 		</div>
			// 	</div>
			// 	{cartItems.map((cartItem) => (
			// 		<CheckoutItem key={cartItem.id} cartItem={cartItem} clicked={this.selectProductHandler} />
			// 	))}
			// 	<div className="total">
			// 		<span>TOTAL: ${total.toFixed(2)}</span>
			// 	</div>
			// 	<div className="test-warning">
			// 		*Please use the following test credit card for test payments*
			// 		<br />
			// 		4242 4242 4242 4242 - Exp: 01/20 - CVV: 123 <br />
			// 		<div className="mt-5 mx-auto text-center">
			// 			<StripeCheckoutButton price={total} done={this.notify} />
			// 		</div>
			// 	</div>
			// </div>
			<div className="container p-1 mx-auto ">
				<div className="row mt-5 mb-3 border-bottom" style={{ fontWeight: 'bold' }}>
					<div className="col-2">
						<span>Product</span>
					</div>
					<div className="col-3">
						<span>Description</span>
					</div>
					<div className="col-2">
						<span>Quantity</span>
					</div>
					<div className="col-2">
						<span>Price</span>
					</div>
					<div className="col-2">
						<span>Remove</span>
					</div>
				</div>
				{cartItems.map((cartItem) => (
					<CheckoutItem key={cartItem.id} cartItem={cartItem} clicked={this.selectProductHandler} />
				))}
				<div className="text-right m-4">
					<div className="total">
						<span>TOTAL: ${total.toFixed(2)}</span>
					</div>
				</div>
				{/* <div className="test-warning d-none">
					*Please use the following test credit card for test payments*
					<br />
					4242 4242 4242 4242 - Exp: 01/20 - CVV: 123 <br />
				</div> */}
				<div className="row mb-5">
					<div className="col-md-6">
						<BillingForm />
					</div>
					<div className="col-md-6">
						<PaymentOptions>
							<div className="text-center p-3">
								<StripeCheckoutButton price={total} done={this.notify} />
							</div>
							<div className="text-center p-3">
								<PaypalButton />
							</div>
						</PaymentOptions>
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
