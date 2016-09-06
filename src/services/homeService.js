import * as requestService from './request';

function filterData(data) {
	if(data.success) {
	  return data.data;
	} else {
		return [];
	}
}

async function getHomeTabs() {
  let {success, data} = await requestService.get('/tabs');
  if (success) {
  	return data;
  } else {
  	return [];
  }
}