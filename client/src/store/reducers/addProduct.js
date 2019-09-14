import * as actionType from '../actions/actionTypes';

const initialState = {
	variations: []
};

const addProductReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionType.ADD_VARIATIONS:
			return {
				...state,
				variations: action.payload
			};
		default:
			return state;
	}
};

export default addProductReducer;
