import qs from 'query-string';
import { host } from '../config';

const urlPrefix = 'http://' + host + '/api/v1/data';

function filterJSON(res) {
	return res.json();
}

function filterStatus(res) {
	if (res.status >= 200 && res.status < 300) {
		return res;
	}
	else {
		let error = new Error(res.statusText);
		error.res = res;
		error.type = 'http';
		throw error;
	}
}

export function get(url, params) {
	url = urlPrefix + url;
	if (params) {
		url += `?${qs.stringify(params)}`;
	}

	if (true) {
		console.info(`GET: `, url);
		console.info(`Params: `, params)
	}

	return fetch(url)
		.then(filterStatus)
		.then(filterJSON);
}

export function post(url, body) {
	url = urlPrefix + url;

	if (true) {
		console.info(`POST: `, url);
		console.info(`Body: `, body);
	}

	return fetch(url, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-API-Key': 'foobar'
		},
		body: JSON.stringify(body)
	})
		.then(filterStatus)
		.then(filterJSON);
}


