import * as requestService from './request';

function filterResult(result) {
	if(result.success) {
	  return result.data;
	} else {
		return {};
	}
}

export function getRepliesByTopicId(topicId='', currentPage=1) {
  return requestService.post(`/${topicId}/replies/data`, {currentPage}).then(filterResult);
}