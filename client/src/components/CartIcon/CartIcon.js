import React from 'react';
import { connect } from 'react-redux';
import { toggleCartHidden } from '../../store/actions/cart';
import { selectCartItemsCount } from '../../store/selectors/cart';

import './CartIcon.css';

const cartIcon = ({ toggleCartHidden, items }) => {
	return (
		<i className="fas fa-shopping-cart" onClick={toggleCartHidden}>
			{' '}
			{items > 0 && <span className="badge badge-danger">{items}</span>}
		</i>
	);
};

const mapStateToProps = (state) => ({
	items: selectCartItemsCount(state)
});

const mapDispatchToProps = (dispatch) => {
	return {
		toggleCartHidden: () => dispatch(toggleCartHidden())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(cartIcon);
