import React from 'react';

import PurchaseItem from '../../components/PurchaseItem/PurchaseItem';

const orders = ({ orders, filterInput, filterOrders }) => {
	return (
		<div className="container-fluid m-3">
			<div className="d-flex justify-content-end m-5">
				<input
					className="form-control col-md-3"
					placeholder="Search by Order Number / Email"
					name="filterInput"
					value={filterInput}
					onChange={filterOrders}
				/>
			</div>
			<div className="row purchase-history__header border-bottom  bg-light p-3">
				<div className="col-12 col-md-3">
					<h3>Orders</h3>
				</div>
				<div className="col-md-2">
					<span>Email</span>
				</div>
				<div className="col-md-2">
					<span>Address</span>
				</div>
				<div className="col-md-2">
					<span>Date</span>
				</div>
				<div className="col-md-1">
					<span>Total Price</span>
				</div>
				<div className="col-md-2">
					<span>Payment Type</span>
				</div>
			</div>
			{orders &&
				orders.map((order) => {
					return <PurchaseItem key={order.orderId} order={order} admin />;
				})}
		</div>
	);
};

export default orders;
