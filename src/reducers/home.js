import * as types from '../constants/ActionTypes';

const initialState = {
  selectedMenu: '',
  menus: [],
  topics: []
};

export default function (state = initialState, action) {

  const {payload, error, meta = {}, type} = action;
  const {sequence = {}, menu, id = '0', replyId = '0', userId = '0', content = '', user = {}} = meta;

  if (sequence.type === 'start' || error) {
    return state;
  }

  switch (action.type) {
	case types.GET_HOME_MENUS:
      let data = action.payload;
	  return {
        ...state,
        menus: data.menus,
        selectedMenu: data.selectedMenu,
        topics: data.topics
	  };
	case types.GET_TOPICS_BY_MENU:
	  return {
	    ...state,
	    topics: action.payload,
	    selectedMenu: menu
	  };
	case types.UPDATE_MENU:
	  return {
	  	...state,
	  	selectedMenu: action.payload
	  };
	 default:
	    return state;
	}
}