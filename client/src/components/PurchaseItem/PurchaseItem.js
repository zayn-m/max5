import React from 'react';

const purchaseItem = ({ order }) => (
	<div className="row mt-3 purchase-history__item border-bottom">
		<div className="col-12 col-md-4 d-flex">
			<div className="w-50 text-center">
				<span className="mx-auto">
					<i className="fas fa-shopping-cart fa-2x text-danger" />
				</span>
			</div>
			<div className="w-50 ">
				<label className="text-muted">{order.purchasedItemsCount} Products Purchased</label>
			</div>
		</div>
		<div className="col-md-2">
			<span>{order.address}</span>
		</div>
		<div className="col-md-2">
			<span>{Date(order.created)}</span>
		</div>
		<div className="col-md-2">
			<strong>${order.totalPrice} </strong>
		</div>
		<div className="col-md-2">
			<span>{order.paymentType}</span>
		</div>
	</div>
);

export default purchaseItem;
