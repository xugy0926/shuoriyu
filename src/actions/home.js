import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as homeService from '../services/homeService';
import * as topicService from '../services/topicService'

export const getHomeMenus = createAction(types.GET_HOME_MENUS, async()=> {
  const menus = await homeService.getMenus();
  let selectedMenuKey = '';
  let selectedSubmenuKey = '';

  if (menus && menus.length > 0) {
    selectedMenuKey = menus[0].key;
    if (menus[0].submenus && menus[0].submenus.length > 0) {
      selectedSubmenuKey = menus[0].submenus[0].key;
    }

    let topics = await topicService.getTopicsByMenu(selectedMenuKey, selectedSubmenuKey);
    return {selectedMenuKey: selectedMenuKey, selectedSubmenuKey: selectedSubmenuKey, menus: menus, topics: topics};
  } else {
    return {selectedMenuKey: '', selectedSubmenuKey: '', menus: [], topics: []};
  }
});

export const updateMenu = createAction(types.UPDATE_MENU, (selectedMenuKey, selectedSubmenuKey)=> {
  return {
	selectedMenuKey,
	selectedSubmenuKey
  }
});