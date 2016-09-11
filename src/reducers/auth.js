import * as types from '../constants/ActionTypes';


const initialState = {
	user: {}
};


export default function (state = initialState, action) {
	const {payload, error, meta = {}, type} = action;
	const {sequence = {}} = meta;
	if (sequence.type === 'start' || error) {
		return state;
	}

    console.log('-------');
    console.log(payload);
	switch (type) {
		case types.SIGNIN:
			return {
				...state,
				user: payload
			};
		case types.SIGNUP:
			return {
                ...state,
                user: payload
			};
		case types.SIGNOUT:
			return initialState;
		default:
			return state;
	}
}
