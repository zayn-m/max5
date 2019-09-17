import React from 'react';
import { Link } from 'react-router-dom';
import { HOST_URL } from '../../settings';
import './PurchaseItem.css';

class PurchaseItem extends React.Component {
	state = {
		show: false
	};

	selectItemHandler = (category, id) => {
		const url = `${HOST_URL}/shop/${category}/${id}`;
		window.open(url, '_blank');
	};

	render() {
		const { order, admin } = this.props;
		const date = parseInt(order.created);
		const d = new Date(date);
		const ds = d.toLocaleString();
		return (
			<div className="row mt-3 purchase-history__item border-bottom">
				<div className={`col-12 ${admin ? 'col-md-3' : 'col-md-4'}  d-flex`}>
					<div className="w-50 text-center ">
						<span className="mx-auto">
							{admin ? (
								<strong>#{order.orderNo}</strong>
							) : (
								<i className="fas fa-shopping-cart fa-2x text-danger" />
							)}
						</span>
					</div>
					<div className="w-50 ">
						<label className="text-muted">{order.purchasedItemsCount} Products Purchased</label>
						<small className="text-primary">
							{!this.state.show ? (
								<span
									style={{ cursor: 'pointer', textDecoration: 'underline' }}
									onClick={() => this.setState({ show: true })}
								>
									View
								</span>
							) : (
								<div className="d-flex flex-column">
									{order.items.map((i) => (
										<div key={i} className="p-1 border-bottom mb-3">
											{i.name}&nbsp;x&nbsp;{i.quantity}&nbsp;-&nbsp;{i.price}
										</div>
									))}
									<span
										style={{ cursor: 'pointer', textDecoration: 'underline' }}
										onClick={() => this.setState({ show: false })}
									>
										Hide
									</span>
								</div>
							)}
						</small>
					</div>
				</div>
				{admin && (
					<div className="col-md-2">
						<span>{order.email}</span>
					</div>
				)}
				<div className="col-md-2 ">
					<span>{order.address}</span>
				</div>
				<div className="col-md-2">
					<span>{ds}</span>
				</div>
				<div className={`${admin ? 'col-md-1' : 'col-md-2'}`}>
					<strong>${order.totalPrice} </strong>
				</div>
				<div className="col-md-2">
					<span>{order.paymentType}</span>
				</div>
			</div>
		);
	}
}

export default PurchaseItem;
