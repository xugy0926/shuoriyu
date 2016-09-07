import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as homeService from '../services/homeService';
import * as topicService from '../services/topicService'

export const getHomeTabs = createAction(types.GET_HOME_TABS, async()=> {
	const tabs = await homeService.getTabs();
    let selectedTab = '';

    if (tabs && tabs.length > 0) {
      selectedTab = tabs[0].key;
    }

	let topics = await topicService.getTopicsByTab(selectedTab);
	return {selectedTab: selectedTab, tabs: tabs, topics: topics};
  }
);

export const updateTab = createAction(types.UPDATE_TAB, (tab)=> {
	return {
		tab
	}
});