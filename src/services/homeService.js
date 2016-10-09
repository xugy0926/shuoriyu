import * as requestService from './request';

function filterData(result) {
	if(result.success) {
	  return result.data;
	} else {
		return [];
	}
}

export function getMenus() {
  return requestService.post('/menu/data').then(filterData);
}