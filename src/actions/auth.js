import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as authService from '../services/authService';
import * as storage from '../services/storage';

export const checkToken = createAction(types.CHECK_TOKEN, async(token)=> {
	if (storage.getToken()) {
		let user = await authService.checkToken(storage.getToken());
        saveSecret(user);
        return user;
	}
});

export const onSignin = createAction(types.SIGNIN, async(name, password)=> {
	let user = await authService.signin(name, password);
    saveSecret(user);
	return user;
});

export const onSignup = createAction(types.SIGNUP, async(name, email, password, rePassword, code)=> {
	let user = await authService.signup(name, email, password, rePassword, code);
    saveSecret(user);
	return user;
});

export const onSignout = function () {

    removeSecret();

	return {
		type: types.SIGNOUT
	}
}

function saveSecret(user) {
	if (user) {
	  storage.setToken(user._id);
	  storage.setSecret(user);
	}
}

function removeSecret() {
	storage.removeToken();
	storage.removeSecret();
}