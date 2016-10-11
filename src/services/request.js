import qs from 'query-string';
import { host, node_env } from '../config';
import * as storage from './storage';

const urlPrefix = 'http://' + host + '/api/v1/data'
const isDebugging = node_env === 'development'

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

	if (isDebugging) {
		console.info(`GET: `, url);
		console.info(`Params: `, params)
	}

	return fetch(url)
		.then(filterStatus)
		.then(filterJSON);
}

export function post(url, body = {}) {
    let accessToken = storage.getAccessToken()

    body = {...body, accessToken}

	url = urlPrefix + url;

	if (isDebugging) {
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


