import React from 'react';
import { connect } from 'react-redux';
import { getUserOrders } from '../../firebase/firebaseUtils';

import PurchaseItem from '../../components/PurchaseItem/PurchaseItem';

class PurchaseHistory extends React.Component {
	state = {
		orders: []
	};

	componentDidMount() {
		getUserOrders(this.props.currentUser)
			.then((res) => this.setState({ orders: res }))
			.catch((err) => console.log(err));
	}

	render() {
		const { orders } = this.state;
		return (
			<div className="container m-5 mx-auto ">
				<div className="row purchase-history__header border-bottom">
					<div className="col-12 col-md-4">
						<h3>Purchase history</h3>
					</div>

					<div className="col-md-2 purchase-history__header--col">
						<span>Address</span>
					</div>
					<div className="col-md-2 purchase-history__header--col">
						<span>Date</span>
					</div>
					<div className="col-md-2 purchase-history__header--col">
						<span>Total Price</span>
					</div>
					<div className="col-md-2 purchase-history__header--col">
						<span>Payment Type</span>
					</div>
				</div>

				{orders &&
					orders.map((order) => {
						return <PurchaseItem key={order.orderId} order={order} />;
					})}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	currentUser: state.userReducer.currentUser
});

export default connect(mapStateToProps)(PurchaseHistory);
