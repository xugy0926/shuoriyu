import * as types from '../constants/ActionTypes'
import _ from 'lodash'

const initialState = {
  selectedMenuKey: '',
  selectedSubmenuKey: '',
  menus: [],
  topics: [],
  topic: {},
  replies: {}
};

export default function (state = initialState, action) {

  const {payload, error, meta = {}, type} = action;
  const {sequence = {}, selectedMenu = {},  id = '0', topicId = '0', replyId = '0', userId = '0', content = '', user = {}} = meta;

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
	case types.GET_TOPIC_BY_ID:
	  return {
        ...state,
        topic: payload,
	  };
	case types.GET_REPLIES_BY_TOPIC_ID:
  {
    let replies = payload.replies

    replies.forEach( function(item) {
      let index = _.findIndex(payload.authors, function(i) {
        return i._id === item.author_id
      })

      if (index >= 0) {
        item.author = payload.authors[index]
      }
    })

	  return {
	    ...state,
        replies: {
     	  currentPage: payload.currentPage,
     	  pages: payload.pages,
     	  replies: replies
      }
	  };
  }
  case types.GET_MORE_REPLIES_BY_TOPIC_ID:
  {
    let replies = payload.replies

    replies.forEach( function(item) {
      let index = _.findIndex(payload.authors, function(i) {
        return i._id === item.author_id
      })

      if (index >= 0) {
        item.author = payload.authors[index]
      }
    })

    return {
      ...state,
        replies: {
        currentPage: payload.currentPage,
        pages: payload.pages,
        replies: state.replies.replies.concat(replies)
      }
    };
  }   
  default:
    return state;
	}
}