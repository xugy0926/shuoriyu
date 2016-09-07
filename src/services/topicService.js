import * as requestService from './request';

function filterData(data) {
	if(data.success) {
	  return data.data;
	} else {
		return [];
	}
}

export function getTopicsByTab(tab = 'all') {
  return requestService.get('/topics', {tab}).then(filterData);
}