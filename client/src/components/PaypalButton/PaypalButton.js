import React from 'react';
import { PayPalButton } from 'react-paypal-button-v2';

const paypalButton = () => (
	<PayPalButton
		amount="0.01"
		onSuccess={(details, data) => {
			console.log(details, data);
			alert('Transaction completed by ' + details.payer.name.given_name);

			// OPTIONAL: Call your server to save the transaction
			return fetch('/paypal-transaction-complete', {
				method: 'post',
				body: JSON.stringify({
					orderID: data.orderID
				})
			});
		}}
	/>
);

export default paypalButton;
