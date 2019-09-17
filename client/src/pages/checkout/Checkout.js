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
	state = {
		controls: {
			name: '',
			email: '',
			address: '',
			address2: '',
			city: '',
			zip: ''
		},
		region: '',
		country: '',
		showPaymentMethod: false,
		option: ''
	};

	componentDidMount() {
		if (this.props.currentUser) {
			const controls = { ...this.state.controls };
			controls['email'] = this.props.currentUser.email;
			this.setState({ controls: controls });
		}
	}

	selectProductHandler = (id, category) => {
		this.props.history.push({
			pathname: `/shop/${category}/${id}`
		});
	};

	notify = () => {
		toast('Your order has been placed!');
	};

	handleInputChange = (e) => {
		const { value, name } = e.target;

		const controls = { ...this.state.controls };
		controls[name] = value;
		this.setState({ controls: controls });
	};

	selectCountry = (val) => {
		this.setState({ country: val });
	};

	selectRegion = (val) => {
		this.setState({ region: val });
	};

	submitHandler = (e) => {
		e.preventDefault();
		const { controls } = this.state;
		if (controls.name && controls.email && controls.address) {
			this.setState({ showPaymentMethod: true });
		}
	};

	render() {
		const { showPaymentMethod, option, controls, region, country } = this.state;
		const { cartItems, total, currentUser } = this.props;
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

				<div className="row mb-5">
					<div className="col-md-6">
						<BillingForm
							controls={controls}
							region={region}
							country={country}
							currentUser={currentUser}
							regionChange={this.selectRegion}
							countryChange={this.selectCountry}
							handleChange={this.handleInputChange}
							submit={this.submitHandler}
						/>
					</div>
					<div
						className="col-md-6"
						style={{ pointerEvents: !showPaymentMethod && 'none', opacity: !showPaymentMethod && '.8' }}
					>
						<PaymentOptions handleClick={(e) => this.setState({ option: e.target.value })}>
							{!showPaymentMethod && (
								<div className="m-3 text-center">
									<label className="text-danger">*Please fill out the form to proceed.</label>
								</div>
							)}
							{option === 'stripe' &&
							showPaymentMethod && (
								<div className="text-center p-3">
									<StripeCheckoutButton
										price={total}
										userData={controls}
										region={region}
										country={country}
										done={this.notify}
									/>
								</div>
							)}
							{option === 'paypal' &&
							showPaymentMethod && (
								<div className="text-center p-3">
									<PaypalButton price={total} userData={controls} region={region} country={country} />
								</div>
							)}
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
