import React from 'react';
import { connect } from 'react-redux';
import { addItem, clearItemFromCart, removeItem } from '../../store/actions/cart';

import './CheckoutItem.css';

const checkoutItem = ({ cartItem, clearItem, addItem, removeItem, clicked }) => {
	const { id, category, name, imageUrl, price, quantity } = cartItem;

	return (
		<div className="checkout-item">
			<div
				className="checkout-item__image-container"
				style={{ cursor: 'pointer' }}
				onClick={() => clicked(id, category)}
			>
				<img className="checkout-item__image-container--img" src={imageUrl} alt="item" />
			</div>
			<span className="checkout-item__name">{name}</span>
			<span className="checkout-item__quantity">
				<div className="checkout-item__quantity--arrow" onClick={() => removeItem(cartItem)}>
					&#10094;
				</div>
				<span className="checkout-item__quantity--value">{quantity}</span>
				{/* <div className="checkout-item__quantity--arrow" onClick={() => addItem(cartItem)}>
					&#10095;
				</div> */}
			</span>
			<span className="checkout-item__price">${price}</span>
			<div className="checkout-item__remove-button" onClick={() => clearItem(cartItem)}>
				&#10005;
			</div>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	clearItem: (item) => dispatch(clearItemFromCart(item)),
	addItem: (item) => dispatch(addItem(item)),
	removeItem: (item) => dispatch(removeItem(item))
});

export default connect(null, mapDispatchToProps)(checkoutItem);
