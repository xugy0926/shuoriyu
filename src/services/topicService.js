import * as requestService from './request';

function filterData(data) {
	if(data.success) {
	  return data.data;
	} else {
		return [];
	}
}

export function getTopicsByMenu(menu = 'all', submenu = '') {
  return requestService.get('/topics', {menu, submenu}).then(filterData);
}

export function getTopicById(id) {
  return requestService.get('/topic_data/' + id).then(filterData);
}