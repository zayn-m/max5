import React from 'react';

import PurchaseItem from '../../components/PurchaseItem/PurchaseItem';

const orders = ({ orders }) => {
	return (
		<div className="container m-5 mx-auto ">
			<div className="row purchase-history__header border-bottom">
				<div className="col-12 col-md-4">
					<h3>Orders</h3>
				</div>
				<div className="col-md-2">
					<span>Address</span>
				</div>
				<div className="col-md-2">
					<span>Date</span>
				</div>
				<div className="col-md-2">
					<span>Total Price</span>
				</div>
				<div className="col-md-2">
					<span>Payment Type</span>
				</div>
			</div>

			{orders &&
				orders.map((order) => {
					return <PurchaseItem key={order.orderId} order={order} />;
				})}
		</div>
	);
};

export default orders;
