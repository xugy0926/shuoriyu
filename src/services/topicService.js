import * as requestService from './request';

function filterData(data) {
	if(data.success) {
	  return data.data;
	} else {
		return [];
	}
}

export function getTopicsByMenu(menuKey = 'all', submenuKey = '') {
  return requestService.post('/topics', {menuKey, submenuKey}).then(filterData);
}

export function getTopicById(id) {
  return requestService.post(`/topic/${id}/data`).then(filterData);
}