import * as requestService from './request';

function filterResult(result) {
	if(result.success) {
	  console.log('-----1')
	  console.log(result.data)
	  return result.data;
	} else {
		console.log('-----2')
		console.log(result.message)
		return {};
	}
}

export function getRepliesByTopicId(topicId = '', currentPage = 1) {
  return requestService.post(`/${topicId}/replies/data`, {currentPage}).then(filterResult)
}

export function submitReply(topicId, content) {
  return requestService.post(`/reply/${topicId}/reply`, {content}).then(filterResult)
}