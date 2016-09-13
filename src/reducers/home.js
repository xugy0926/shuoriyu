import * as types from '../constants/ActionTypes';

const initialState = {
  selectedMenuKey: '',
  selectedSubmenuKey: '',
  menus: [],
  topics: []
};

export default function (state = initialState, action) {

  const {payload, error, meta = {}, type} = action;
  const {sequence = {}, selectedMenu = {},  id = '0', replyId = '0', userId = '0', content = '', user = {}} = meta;

  if (sequence.type === 'start' || error) {
    return state;
  }

  console.log(payload);

  switch (action.type) {
	case types.GET_HOME_MENUS:
      let data = action.payload;
	  return {
        ...state,
        menus: payload.menus,
        selectedMenuKey: payload.selectedMenuKey,
        selectedSubmenuKey: payload.selectedSubmenuKey,
        topics: payload.topics
	  };
	case types.GET_TOPICS_BY_MENU:
	  return {
	    ...state,
	    topics: payload,
	    selectedMenuKey: selectedMenu.selectedMenuKey,
	    selectedSubmenuKey: selectedMenu.selectedSubmenuKey
	  };
	case types.UPDATE_MENU:
	  return {
	  	...state,
	  	selectedMenuKey: payload.selectedMenuKey,
	  	selectedSubmenuKey: payload.selectedSubmenuKey
	  };
	 default:
	    return state;
	}
}