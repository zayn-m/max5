import React from 'react';

const paymentOptions = ({ children }) => (
	<form onSubmit={(e) => e.preventDefault()}>
		<h3>Payment Method</h3>
		<hr />
		{children}
	</form>
);

export default paymentOptions;
