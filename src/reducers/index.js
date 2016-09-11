import { combineReducers } from 'redux';
import home from './home';
import auth from './auth';

export default combineReducers({
	home,
	auth
});
