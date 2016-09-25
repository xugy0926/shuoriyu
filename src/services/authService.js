import * as requestService from './request';

function filterData(data) {
	console.log('filetr');
	console.log(data);
	if(data.success) {
	  return {user: data.data, active: data.active};
	} else {
		return {};
	}
}

export function signin(loginname, password) {
  return requestService.post('/user/signin', {loginname, password}).then(filterData);
}

export function signup(loginname, email, password, rePassword) {
  return requestService.post('/user/signup', {loginname, email, password, rePassword}).then(filterData);
}

export function checkToken(accessToken) {
  console.log('------');
  console.log(accessToken);
  return requestService.post('/user/accesstoken', {accessToken}).then(filterData);
}