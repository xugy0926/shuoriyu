import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as topicService from '../services/topicService';

export const getTopicsByMenu = createAction(types.GET_TOPICS_BY_MENU, async(menu)=> {
	return await topicService.getTopicsByMenu(menu);
}, (menu)=> {
	return {
		menu
	}
});