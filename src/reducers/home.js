import * as types from '../constants/ActionTypes';

const initialState = {
  selectedTab: '',
  tabs: [],
  topics: []
};

export default function (state = initialState, action) {
  switch (action.type) {
	case types.GET_HOME_TABS:
      let data = action.payload;

      
	  return {
        ...state,
        tabs: data.tabs,
        selectedTab: data.selectedTab,
        topics: data.topics
	  };
	case types.GET_TOPICS_BY_TAB:
	  return {
	    ...state,
	    topics: action.payload
	  };
	  default:
	    return state;
	}
}