import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as replyService from '../services/replyService';

export const getRepliesByTopicId = createAction(
  types.GET_REPLIES_BY_TOPIC_ID, 
  async(topicId, currentPage = 1) => {
    return await replyService.getRepliesByTopicId(topicId, currentPage)
}, (topicId)=> {
  return topicId
});

export const getMoreRepliesByTopicId = createAction(types.GET_MORE_REPLIES_BY_TOPIC_ID,
  async(topicId, currentPage) => {
    return await replyService.getRepliesByTopicId(topicId, currentPage)
}, (topicId) => {
  return topicId
});

export const submitReply = createAction(types.SUBMIT_REPLY,
  async(topicId, content) => {
    return await replyService.submitReply(topicId, content)
}, (topicId) => {
  return topicId
});