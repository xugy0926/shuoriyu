import * as requestService from './request';

function filterData(data) {
	if(data.success) {
	  return data.data;
	} else {
		return [];
	}
}

export function getMenus() {
  return requestService.post('/menu/data').then(filterData);
}