import React from 'react';

const paymentOptions = ({ handleClick, children }) => (
	<form onSubmit={(e) => e.preventDefault()}>
		<h3>Payment Method</h3>
		<hr />
		<div className="custom-control custom-radio">
			<input
				type="radio"
				id="creditcardRadio"
				name="paymentRadio"
				value="stripe"
				className="custom-control-input"
				onClick={handleClick}
			/>
			<label className="custom-control-label" htmlFor="creditcardRadio">
				Credit Card
			</label>
		</div>
		<div className="custom-control custom-radio">
			<input
				type="radio"
				id="paypalRadio"
				name="paymentRadio"
				value="paypal"
				className="custom-control-input"
				onClick={handleClick}
			/>
			<label className="custom-control-label" htmlFor="paypalRadio">
				Paypal
			</label>
		</div>
		{children}
	</form>
);

export default paymentOptions;
