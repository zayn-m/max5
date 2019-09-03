import React from 'react';
import { connect } from 'react-redux';
import { selectCartItems } from '../../store/selectors/cart';
import { withRouter } from 'react-router';
import { toggleCartHidden } from '../../store/actions/cart';

import './CartDropdown.css';
import CartItem from '../CartItem/CartItem';

const cartDropdown = ({ items, history, dispatch }) => (
	<div className="cart-dropdown">
		<div className="cart-items">
			{items.length ? (
				items.map((item) => <CartItem key={item.id} item={item} />)
			) : (
				<span className="empty-message">Your cart is empty</span>
			)}
		</div>
		<button
			className="btn btn-light"
			onClick={() => {
				history.push('/checkout');
				dispatch(toggleCartHidden());
			}}
		>
			CHECKOUT
		</button>
	</div>
);

const mapStateToProps = (state) => ({
	items: selectCartItems(state)
});

export default withRouter(connect(mapStateToProps)(cartDropdown));
