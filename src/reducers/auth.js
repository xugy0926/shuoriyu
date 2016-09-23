import * as types from '../constants/ActionTypes';

const initialState = {
	active: false,
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
				active: payload.active || false,
				secret: payload.user
			}
		case types.SIGNIN:
			return {
				...state,
				active: payload.active || false,
				secret: payload.user
			};
		case types.SIGNUP:
			return {
                ...state,
                active: payload.active || false,
                secret: payload.user
			};
		case types.SIGNOUT:
			return initialState;
		default:
			return state;
	}
}
