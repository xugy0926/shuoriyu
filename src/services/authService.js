import * as requestService from './request';

function filterData(data) {
	if(data.success) {
	  return data.data;
	} else {
		return {};
	}
}

export function signin(name, pass) {
  return requestService.post('/signin', {name, pass}).then(filterData);
}

export function signup(loginname, email, pass, rePass) {
  return requestService.post('/signup', {loginname, email, pass, rePass}).then(filterData);
}

export function checkToken(accesstoken) {
  return requestService.post('/accesstoken', {accesstoken}).then(filterData);
}