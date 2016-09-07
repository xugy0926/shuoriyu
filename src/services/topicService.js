import * as requestService from './request';

function filterData(data) {
	if(data.success) {
	  return data.data;
	} else {
		return [];
	}
}

export async function getTopicsByTab(tab = 'all') {

  let tabs = await getTabs();
  console.log('----------------2');
  console.log(tabs);

  let data = await requestService.get('/topics', {tab}).then(filterData);
  return data;
}

async function getTabs() {
  let {success, data} = await requestService.get('/tabs');
  if (success) {
  	return data;
  } else {
  	return [];
  }
}