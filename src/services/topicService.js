import * as requestService from './request';

function filterData(data) {
	if(data.success) {
	  return data.data;
	} else {
		return [];
	}
}

export function getTopicsByMenu(menu = 'all', submenu = '') {
	console.log('-----');
  console.log(submenu);
  return requestService.get('/topics', {menu, submenu}).then(filterData);
}