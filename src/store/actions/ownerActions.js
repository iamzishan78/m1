import {
	RESET_SHAPE_OWNER,
	GET_SHAPE_OWNERS_AND_WELLS,
	GET_SHAPE_OWNERS_AND_COUNT,
	GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT,
	GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS,
	EXEC_ASYNC_EXPORT_JOB,
} from 'store/type';

export const getShapeOwnersAndCountAction = {
	STARTED: payload => ({ type: GET_SHAPE_OWNERS_AND_COUNT.STARTED, payload }),
	FULLFILLED: payload => ({
		type: GET_SHAPE_OWNERS_AND_COUNT.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: GET_SHAPE_OWNERS_AND_COUNT.REJECTED }),
};

export const getShapeOwnersAndWellsAction = {
	STARTED: payload => ({ type: GET_SHAPE_OWNERS_AND_WELLS.STARTED, payload }),
	FULLFILLED: payload => ({
		type: GET_SHAPE_OWNERS_AND_WELLS.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: GET_SHAPE_OWNERS_AND_WELLS.REJECTED }),
};

export const getMapFilterShapeOwnersAndCountAction = {
	STARTED: payload => ({
		type: GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.STARTED,
		payload,
	}),
	FULLFILLED: payload => ({
		type: GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.REJECTED }),
};

export const getMapFilterShapeOwnersAndWellsAction = {
	STARTED: payload => ({
		type: GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS.STARTED,
		payload,
	}),
	FULLFILLED: payload => ({
		type: GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS.REJECTED }),
};

export const execAsyncExportJobAction = {
	STARTED: payload => ({ type: EXEC_ASYNC_EXPORT_JOB.STARTED, payload }),
	FULLFILLED: payload => ({
		type: EXEC_ASYNC_EXPORT_JOB.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: EXEC_ASYNC_EXPORT_JOB.REJECTED }),
};

export const resetShapeOwnerAction = () => ({ type: RESET_SHAPE_OWNER });
