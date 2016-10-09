import * as requestService from './request';

function filterResult(result) {
	if(result.success) {
	  return result.data;
	} else {
		return [];
	}
}

export function getTopicsByMenu(menuKey = 'all', submenuKey = '') {
  return requestService.post('/topics', {menuKey, submenuKey}).then(filterResult);
}

export function getTopicById(id) {
  return requestService.post(`/topic/${id}/data`).then(filterResult);
}