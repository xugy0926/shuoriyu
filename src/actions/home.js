import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as homeService from '../services/homeService';
import * as topicService from '../services/topicService'

export const getHomeMenus = createAction(types.GET_HOME_MENUS, async()=> {
	const menus = await homeService.getMenus();
    let selectedMenu = '';
    console.log(menus);

    if (menus && menus.length > 0) {
      selectedMenu = menus[0].key;
    }

	let topics = await topicService.getTopicsByMenu(selectedMenu);
	return {selectedMenu: selectedMenu, menus: menus, topics: topics};
  }
);

export const updateMenu = createAction(types.UPDATE_MENU, (menu)=> {
	return {
		menu
	}
});