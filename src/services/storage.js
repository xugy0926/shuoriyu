

export function getToken() {
	return localStorage.getItem('user_token') || '';
}

export function setToken(token) {
	localStorage.setItem('user_token', token);
}

export function removeToken() {
	localStorage.removeItem('user_token');
}

export function getSecret() {
	return localStorage.getItem('user_secret') || '';
}

export function setSecret(user) {
	if (user && typeof(user) === 'object') {
      localStorage.setItem('user_secret', JSON.stringify(user));
	}
}

export function removeSecret() {
	localStorage.removeItem('user_secret');
}