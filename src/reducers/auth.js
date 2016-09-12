import * as types from '../constants/ActionTypes';

const initialState = {
	secret: {}
};

export default function (state = initialState, action) {
	const {payload, error, meta = {}, type} = action;
	const {sequence = {}} = meta;
	if (sequence.type === 'start' || error) {
		return state;
	}

	switch (type) {
		case types.CHECK_TOKEN:
			return {
				...state,
				secret: payload
			}
		case types.SIGNIN:
			return {
				...state,
				secret: payload
			};
		case types.SIGNUP:
			return {
                ...state,
                secret: payload
			};
		case types.SIGNOUT:
			return initialState;
		default:
			return state;
	}
}
