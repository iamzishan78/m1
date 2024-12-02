import { GET_OWNER_ENTITY_DETAILS } from 'store/type';

const INIT_STATE = {
	ownerEntityDetail: null,
};

const entityReducer = (state = INIT_STATE, action) => {
	switch (action.type) {
		case GET_OWNER_ENTITY_DETAILS.FULLFILLED: {
			return { ...state, ownerEntityDetail: action.payload };
		}

		default:
			return state;
	}
};

export default entityReducer;
