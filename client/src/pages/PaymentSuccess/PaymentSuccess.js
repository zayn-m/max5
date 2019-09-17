import React from 'react';

const paymentSuccess = ({ location }) => {
	return (
		<div className="container m-5">
			<div class="alert alert-success" role="alert">
				<h4 class="alert-heading">Payment Successful!</h4>
				<p>
					Thanks for placing your order. Your order number is <strong>{location.state.order}</strong>. Please
					save it somewhere safe. We will contact you soon. Happy Shopping!
				</p>
				<hr />
				<p class="mb-0">For any queries feel free to contact us.</p>
			</div>
		</div>
	);
};

export default paymentSuccess;
