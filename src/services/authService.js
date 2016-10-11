import * as requestService from './request';

function filterResult(result) {
  if(result.success) {
  	let {user, active} = result.data
	return {user: user, active: active};
  } else {
    return {};
  }
}

export function signin(loginname, password) {
  return requestService.post('/user/signin', {loginname, password}).then(filterResult);
}

export function signup(loginname, email, password, rePassword) {
  return requestService.post('/user/signup', {loginname, email, password, rePassword}).then(filterResult);
}

export function checkAccessToken(accessToken) {
  return requestService.post('/user/accesstoken', {accessToken}).then(filterResult);
}