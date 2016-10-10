import * as requestService from './request';

function filterData(result) {
  if(result.success) {
	return {user: result.data, active: result.active};
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
  return requestService.post('/user/accesstoken', {accessToken}).then(filterData);
}