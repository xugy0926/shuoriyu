import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as topicService from '../services/topicService';

export const getTopicsByTab = createAction(types.GET_TOPICS_BY_TAB, async(tab)=> {
	return await topicService.getTopicsByTab(tab);
}, (tab)=> {
	return {
		tab
	}
});