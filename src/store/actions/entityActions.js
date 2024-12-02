import { GET_OWNER_ENTITY_DETAILS } from 'store/type';

export const getOwnerEntityDetailAction = {
	STARTED: payload => ({ type: GET_OWNER_ENTITY_DETAILS.STARTED, payload }),
	FULLFILLED: payload => ({
		type: GET_OWNER_ENTITY_DETAILS.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: GET_OWNER_ENTITY_DETAILS.REJECTED }),
};
