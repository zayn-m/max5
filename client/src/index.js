import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter basename="/">
			<PersistGate persistor={persistor}>
				<App />
			</PersistGate>
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);
