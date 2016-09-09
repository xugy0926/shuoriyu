import * as requestService from './request';

function filterData(data) {
	if(data.success) {
	  return data.data;
	} else {
		return [];
	}
}

export function getTopicsByMenu(menu = 'all') {
  return requestService.get('/topics', {menu}).then(filterData);
}