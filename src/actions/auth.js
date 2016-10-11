import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as authService from '../services/authService';
import * as storage from '../services/storage';

export const tryAuth = createAction(types.CHECK_TOKEN, async(token)=> {
	let accessToken = storage.getAccessToken()
	if (accessToken) {
		let data = await authService.checkAccessToken(storage.getAccessToken());
		if (data.active) {
	      saveSecret(data.user);			
		} else {
		  removeSecret();
		}

	    return data;
	}
});

export const onSignin = createAction(types.SIGNIN, async(name, password)=> {
	let data = await authService.signin(name, password);
    saveSecret(data.user);
	return data;
});

export const onSignup = createAction(types.SIGNUP, async(name, email, password, rePassword, code)=> {
	let data = await authService.signup(name, email, password, rePassword);
    saveSecret(data.user);
	return data;
});

export const onSignout = function () {
    removeSecret();
	return {
		type: types.SIGNOUT
	}
}

function saveSecret(user) {
	if (user) {
	  storage.setAccessToken(user.accessToken);
	  storage.setSecret(user);
	}
}

function removeSecret() {
	storage.removeAccessToken();
	storage.removeSecret();
}