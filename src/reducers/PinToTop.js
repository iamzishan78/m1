import { UPDATE_PIN_COMMENTS } from './../store/type';

const INIT_STATE = {
	pinComment: false,
};

export default function PinReducer(state = INIT_STATE, action) {
	switch (action.type) {
		case UPDATE_PIN_COMMENTS:
			return {
				...state,
				pinComment: action.payload,
			};
		default:
			return state;
	}
}
