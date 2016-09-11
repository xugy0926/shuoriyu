import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as authService from '../services/authService';

export const onSignin = createAction(types.SIGNIN, async(name, password)=> {
	return await authService.signin(name, password);
}, (name)=> {
	return {
	  name
	}
});

export const onSignup = createAction(types.SIGNUP, async(name, email, password, rePassword, code)=> {
	return await authService.signup(name, email, password, rePassword, code);
}, (name)=> {
	return {
	  name
	}
});