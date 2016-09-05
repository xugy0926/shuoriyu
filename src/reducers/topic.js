import * as types from '../constants/ActionTypes';


const initialState = {
	topics: []
};

export default function (state = initialState, action) {
	switch (action.type) {
		case types.GET_TOPICS_BY_TAB:
			return {
				...state,
				topics: action.payload
			};
		default:
			return state;
	}
}