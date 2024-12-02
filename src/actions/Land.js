import { SET_LAND_REDUX_KEY } from 'constants/ActionTypes';

export const setLandReduxKey = (key, value) => ({
	type: SET_LAND_REDUX_KEY,
	payload: { key, value },
});
