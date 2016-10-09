import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as topicService from '../services/topicService';

export const getTopicsByMenu = createAction(types.GET_TOPICS_BY_MENU, async(selectedMenuKey, selectedSubmenuKey) => {
  return await topicService.getTopicsByMenu(selectedMenuKey, selectedSubmenuKey);
}, (selectedMenuKey, selectedSubmenuKey)=> {
  return {
    selectedMenu: {
      selectedMenuKey,
      selectedSubmenuKey		
    }
  }
});

export const getTopicById = createAction(types.GET_TOPIC_BY_ID, async(topicId) => {
  return await topicService.getTopicById(topicId)
});