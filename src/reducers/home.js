import * as types from '../constants/ActionTypes';

const initialState = {
  selectedTab: '',
  tabs: [],
  topics: []
};

export default function (state = initialState, action) {

  const {payload, error, meta = {}, type} = action;
  const {sequence = {}, tab, id = '0', replyId = '0', userId = '0', content = '', user = {}} = meta;

  if (sequence.type === 'start' || error) {
    return state;
  }

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