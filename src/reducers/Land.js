import { SET_LAND_REDUX_KEY } from 'constants/ActionTypes';

const INIT_STATE = {};

export default function LandReducer(state = INIT_STATE, action) {
	switch (action.type) {
		case SET_LAND_REDUX_KEY:
			return {
				...state,
				[action.payload.key]: action.payload.value,
			};
		default:
			return state;
	}
}
