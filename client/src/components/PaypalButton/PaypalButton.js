import React from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import axios from 'axios';

const paypalButton = ({ price, userData, region, country, currentUser, cartItems, clearCart, done, history }) => (
	<PayPalButton
		amount={price.toFixed(2)}
		onSuccess={(details, data) => {
			console.log(details, data);
			axios({
				url: 'paypal-payment',
				method: 'post',
				data: {
					orderID: data.orderID,
					payerID: data.payerID
				}
			})
				.then((res) => {
					// alert('Payment successful');
					console.log(res);
					if (res.status === 'success') {
					}
				})
				.catch((err) => {
					console.log('Payment error: ', err);
				});
		}}
		options={{
			clientId: 'Af925DkD_aMbpDdIfOuwTulUeOpHvRhSMrhF50Hmp2ugwZZCOj0Ie7GEd8lt8eQTdjf77slKoniVWPht',
			disableCard: [ 'visa', 'mastercard', 'amex', 'discover', 'jcb', 'elo', 'hiper' ]
		}}
	/>
);

export default paypalButton;
