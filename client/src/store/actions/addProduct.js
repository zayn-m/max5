import * as actionTypes from './actionTypes';

export const addVariations = (variations) => ({
	type: actionTypes.ADD_VARIATIONS,
	payload: variations
});
