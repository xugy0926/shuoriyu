import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from './promiseMiddleware';
import asyncActionCallbackMiddleware from './asyncActionCallbackMiddleware';
import minPendingTimeMiddleware from './minPendingTime';
import createLogger from 'redux-logger';
import reducers from '../reducers';


let middlewares = [
	thunkMiddleware,
	promiseMiddleware,
	asyncActionCallbackMiddleware,
	minPendingTimeMiddleware
];



export default function configureStore(initialState) {
	const store = applyMiddleware(
		...middlewares
	)(createStore)(reducers, initialState);

	if (module.hot) {
		module.hot.accept(() => {
			const nextRootReducer = require('../reducers/index').default;
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
}






