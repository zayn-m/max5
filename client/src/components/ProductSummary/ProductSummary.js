import React from 'react';
import { connect } from 'react-redux';
import { addItem } from '../../store/actions/cart';

const productSummary = ({ item, children, addItem, currentUser }) => {
	const { name, description, price } = item;

	return (
		<div className="h-100">
			<div className="col-md-5 mx-auto product-summary " style={{ marginTop: '10rem', zIndex: '10' }}>
				<h2>{name}</h2>
				<p>{description}</p>
				<h4>${price}</h4>
				<button className="btn btn-danger mt-3 product-view-btn" onClick={() => addItem(item, currentUser)}>
					Add to Cart
				</button>
			</div>
			{children}
		</div>
	);
};

const mapStateToProps = (state) => ({
	currentUser: state.userReducer.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	addItem: (item, currentUser) => dispatch(addItem(item, currentUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(productSummary);
