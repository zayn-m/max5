import * as actionType from '../actions/actionTypes';
import { addItemToCart, removeItemFromCart } from '../actions/cartUtils';
import { createUserCart } from '../../firebase/firebaseUtils';

const initialState = {
	hidden: true,
	cartItems: []
};

const cartReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionType.TOGGLE_CART_HIDDEN:
			return {
				...state,
				hidden: !state.hidden
			};
		case actionType.ADD_ITEM:
			if (action.currentUser) {
				try {
					createUserCart(action.currentUser, addItemToCart(state.cartItems, action.payload));
				} catch (e) {
					console.log('Error when sending cart to user in reducer', e.message);
				}
			}

			return {
				...state,
				cartItems: addItemToCart(state.cartItems, action.payload, action.qty)
			};
		case actionType.REMOVE_ITEM:
			return {
				...state,
				cartItems: removeItemFromCart(state.cartItems, action.payload)
			};
		case actionType.CLEAR_ITEM_FROM_CART:
			return {
				...state,
				cartItems: state.cartItems.filter((cartItem) => cartItem.id !== action.payload.id)
			};

		case actionType.CLEAR_CART:
			if (action.currentUser) {
				return {
					...state,
					cartItems: []
				};
			}
			break;
		default:
			return state;
	}
};

export default cartReducer;
