import { SET_REVENUE_KEY, SET_REVENUE_PROPERTIES_DATA } from '../constants/ActionTypes';

export const setRevenueKey = (key, value) => ({
	type: SET_REVENUE_KEY,
	payload: { key, value },
});
// for revenue Property Table Data
export const setRevenuePropertyData = payload => ({
	type: SET_REVENUE_PROPERTIES_DATA,
	payload,
});
