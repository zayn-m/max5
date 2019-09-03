import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './reducers/user';
import cartReducer from './reducers/cart';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: [ 'userReducer', 'cartReducer' ]
};

const rootReducer = combineReducers({
	userReducer: userReducer,
	cartReducer: cartReducer
});

export default persistReducer(persistConfig, rootReducer);
