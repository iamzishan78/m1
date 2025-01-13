import {
	RESET_SHAPE_OWNER,
	GET_SHAPE_OWNERS_AND_COUNT,
	GET_SHAPE_OWNERS_AND_WELLS,
	GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT,
	GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS,
	EXEC_ASYNC_EXPORT_JOB,
} from 'store/type';

const INIT_STATE = {
	currentFeature: [],
	search: '',
	filters: [],
	shapeOwnersInterest: [],
	shapeInterestCount: 0,
	shapeOwners: [],
	shapeCount: 0,
	wells: [],
	wellsCount: 0,
	fetching: false,
};

const ownerReducer = (state = INIT_STATE, action) => {
	switch (action.type) {
		case GET_SHAPE_OWNERS_AND_COUNT.STARTED:
		case GET_SHAPE_OWNERS_AND_WELLS.STARTED:
		case GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.STARTED:
		case GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS.STARTED: {
			return { ...state, shapeOwners: [], shapeOwnersInterest: [], wells: [], fetching: true };
		}
		// case EXEC_ASYNC_EXPORT_JOB.STARTED:
		case GET_SHAPE_OWNERS_AND_COUNT.FULLFILLED: {
			return {
				...state,
				shapeOwners: action.payload.shapeOwners,
				shapeCount: action.payload.shapeCount,
				fetching: false,
			};
		}
		case GET_SHAPE_OWNERS_AND_WELLS.FULLFILLED: {
			return {
				...state,
				search: action.payload.search,
				filters: action.payload.filters,
				shapeOwnersInterest: action.payload.shapeOwnersInterest,
				shapeInterestCount: action.payload.shapeInterestCount,
				shapeOwners: action.payload.shapeOwners,
				shapeCount: action.payload.shapeCount,
				wells: action.payload.wells,
				wellsCount: action.payload.wellsCount,
				fetching: false,
			};
		}
		case GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS.FULLFILLED: {
			return {
				...state,
				search: action.payload.search,
				filters: action.payload.filters,
				shapeOwnersInterest: action.payload.shapeOwnersInterest,
				shapeInterestCount: action.payload.shapeInterestCount,
				shapeOwners: action.payload.shapeOwners,
				shapeCount: action.payload.shapeCount,
				wells: action.payload.wells,
				wellsCount: action.payload.wellsCount,
				fetching: false,
			};
		}
		case GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.FULLFILLED: {
			return {
				...state,
				shapeOwners: action.payload.shapeOwners,
				shapeCount: action.payload.shapeCount,
				fetching: false,
			};
		}
		case EXEC_ASYNC_EXPORT_JOB.FULLFILLED:
		case RESET_SHAPE_OWNER:
		case GET_SHAPE_OWNERS_AND_COUNT.REJECTED:
		case GET_SHAPE_OWNERS_AND_WELLS.REJECTED:
		case GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.REJECTED:
		case GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS.REJECTED: {
			return {
				...state,
				wells: [],
				wellsCount: 0,
				shapeOwners: [],
				shapeCount: 0,
				shapeOwnersInterest: [],
				shapeInterestCount: 0,
				fetching: false,
			};
		}
		case EXEC_ASYNC_EXPORT_JOB.REJECTED:
		default:
			return state;
	}
};

export default ownerReducer;
