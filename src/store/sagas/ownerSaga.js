import get from 'lodash/get';
import { call, takeLatest, put, select } from 'redux-saga/effects';

import { getPolygonString } from 'components/Shared/functions';

import { CREATE_JOB } from 'graphQL/useMutationCreateJob';
import { INITIALIZE_EXPORT_JOB } from 'graphQL/useMutationinitializeExportJob';
import { GET_ES_PAGINATED_LIST } from 'graphQL/useQueryESPaginatedList';
import { OWNERS_BY_WELL_IDS } from 'graphQL/useQueryOwnersByWellIds';
import { SHAPE_OWNERS } from 'graphQL/useQueryPaginatedShapeOwners';
import { SHAPEOWNERSCOUNT, SHAPEOWNERSINTERESTCOUNT } from 'graphQL/useQueryShapeOwnersCount';

import { jobController } from 'hookstate/jobStateController';

import {
	getShapeOwnersAndCountAction,
	getShapeOwnersAndWellsAction,
	getMapFilterShapeOwnersAndWellsAction,
	getMapFilterShapeOwnersAndCountAction,
	execAsyncExportJobAction,
} from 'store/actions/ownerActions';
import {
	GET_SHAPE_OWNERS_AND_WELLS,
	GET_SHAPE_OWNERS_AND_COUNT,
	GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS,
	GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT,
	EXEC_ASYNC_EXPORT_JOB,
} from 'store/type';

import { showErrorMessage } from 'actions';
import Api from 'api';

function* getShapeOwnersAndCount(action) {
	try {
		const { currentFeature, userId } = action.payload;
		const polygon = getPolygonString(currentFeature);
		const shapeOwnerCount = yield call(Api.query, SHAPEOWNERSCOUNT, {
			polygon: currentFeature?.geometry,
		});

		const shapeOwner = yield call(Api.query, SHAPE_OWNERS, {
			polygon,
			userId,
			pagination: {
				first: get(shapeOwnerCount, 'data.shapeOwnersCount', 0),
				after: null,
			},
		});

		yield put(
			getShapeOwnersAndCountAction.FULLFILLED({
				shapeOwners: get(shapeOwner, 'data.paginatedShapeOwners.edges', []),
				shapeCount: get(shapeOwnerCount, 'data.shapeOwnersCount', 0),
			})
		);
	} catch (error) {
		yield put(getShapeOwnersAndCountAction.REJECTED());
	}
}

function* getShapeOwnersAndWells(action) {
	try {
		const { client, currentFeature } = action.payload;

		const shapeWellCount = yield client.query({
			query: GET_ES_PAGINATED_LIST,
			variables: {
				esIndex: 'platformData:wells',
				polygon: currentFeature?.geometry,
				pagination: {
					first: 0,
					after: null,
				},
			},
		});

		const shapeOwnerCount = yield client.query({
			query: SHAPEOWNERSCOUNT,
			variables: {
				polygon: currentFeature?.geometry,
			},
		});

		const shapeOwnerInterestCount = yield client.query({
			query: SHAPEOWNERSINTERESTCOUNT,
			variables: {
				polygon: currentFeature?.geometry,
				pagination: {
					first: get(shapeWellCount, 'data.getESPaginatedList.total', 0),
					after: null,
				},
			},
		});

		yield put(
			getShapeOwnersAndWellsAction.FULLFILLED({
				search: '',
				filters: [],
				// shapeOwners: get(taxOwners, 'data.data.ownersByWellIds',[]),
				shapeCount: get(shapeOwnerCount, 'data.shapeOwnersCount', 0),
				// shapeOwnersInterest: get(taxOwnersInterest, 'data.data.ownersInterestByWellIds',[]),
				shapeInterestCount: get(shapeOwnerInterestCount, 'data.shapeOwnersInterestCount', 0),
				// wells: get(wells, 'data.data.getESPaginatedList.hits', []),
				wellsCount: get(shapeWellCount, 'data.getESPaginatedList.total', 0),
			})
		);
	} catch (error) {
		yield put(getShapeOwnersAndWellsAction.REJECTED());
	}
}

function* getMapFilterShapeOwnersAndCount(action) {
	try {
		const { currentFeature, filters, search } = action.payload;

		const wellsCount = yield call(Api.query, GET_ES_PAGINATED_LIST, {
			esIndex: 'platformData:wells',
			search,
			filters,
			polygon: currentFeature?.geometry,
			pagination: {
				first: 0,
				after: null,
			},
		});

		const wells = yield call(Api.query, GET_ES_PAGINATED_LIST, {
			esIndex: 'platformData:wells',
			search,
			filters,
			polygon: currentFeature?.geometry,
			pagination: {
				first: get(wellsCount, 'data.getESPaginatedList.total', 0),
				after: null,
			},
		});
		const wellIds = get(wells, 'data.getESPaginatedList.hits', []).map(well => well.Id);

		let taxOwners = [];

		if (wellIds?.length > 0) {
			taxOwners = yield call(Api.query, OWNERS_BY_WELL_IDS, {
				wellIds: wellIds,
				selectedYear: '2023',
			});
		}

		if (get(taxOwners, 'data.errors', []).length > 0) {
			yield put(showErrorMessage('Failed to fetch Tax Owners'));
		}

		yield put(
			getMapFilterShapeOwnersAndCountAction.FULLFILLED({
				shapeOwners: get(taxOwners, 'data.ownersByWellIds.edges', []),
				shapeCount: get(taxOwners, 'data.ownersByWellIds.edges.length', 0),
			})
		);
	} catch (error) {
		yield put(getMapFilterShapeOwnersAndCountAction.REJECTED());
	}
}

function* getMapFilterShapeOwnersAndWells(action) {
	try {
		const { client, currentFeature, filters, search } = action.payload;

		// const originalFile = await client.mutate({
		//   mutation: ADDFILE,
		//   variables: {
		//     fileName: inputOriginalFile.fileName,
		//     userId,
		//   },
		// })

		const shapeWellCount = yield client.query({
			query: GET_ES_PAGINATED_LIST,
			variables: {
				esIndex: 'platformData:wells',
				search,
				filters,
				polygon: currentFeature?.geometry,
				pagination: {
					first: 0,
					after: null,
				},
			},
		});

		const shapeOwnerCount = yield client.query({
			query: SHAPEOWNERSCOUNT,
			variables: {
				search,
				filters,
				polygon: currentFeature?.geometry,
			},
		});

		const shapeOwnerInterestCount = yield client.query({
			query: SHAPEOWNERSINTERESTCOUNT,
			variables: {
				search,
				filters,
				polygon: currentFeature?.geometry,
				pagination: {
					first: get(shapeWellCount, 'data.getESPaginatedList.total', 0),
					after: null,
				},
			},
		});

		yield put(
			getMapFilterShapeOwnersAndWellsAction.FULLFILLED({
				search,
				filters,
				// shapeOwners: get(taxOwners, 'data.data.ownersByWellIds',[]),
				shapeCount: get(shapeOwnerCount, 'data.shapeOwnersCount', 0),
				// shapeOwnersInterest: get(taxOwnersInterest, 'data.data.ownersInterestByWellIds',[]),
				shapeInterestCount: get(shapeOwnerInterestCount, 'data.shapeOwnersInterestCount', 0),
				// wells: get(wells, 'data.data.getESPaginatedList.hits', []),
				wellsCount: get(shapeWellCount, 'data.getESPaginatedList.total', 0),
			})
		);
	} catch (error) {
		yield put(getMapFilterShapeOwnersAndWellsAction.REJECTED());
	}
}

function* execAsyncExportJob(action) {
	try {
		const { client, currentFeature, userId, exportWells, exportOwners, exportOwnersInterest, setStateApp } =
			action.payload;
		const ownerState = yield select(state => state.owner);

		const jobInitialization = yield client.mutate({
			mutation: INITIALIZE_EXPORT_JOB,
			variables: {
				jobName: 'Shape Export',
				jobType: 'SHAPEEXPORT',
				requestPayload: {
					polygon: currentFeature?.geometry,
					filters: ownerState.filters,
					search: ownerState.search,
					datasets: {
						exportWells,
						exportOwners,
						exportOwnersInterest,
					},
					counts: {
						exportWells: ownerState.wellsCount,
						exportOwners: ownerState.shapeCount,
						exportOwnersInterest: ownerState.shapeInterestCount,
					},
				},
				userId,
			},
		});

		yield client.mutate({
			mutation: CREATE_JOB,
			variables: {
				jobId: jobInitialization?.data?.initializeExportJob?.job?._id,
				sendEmail: false,
			},
		});

		jobController.toggleBulkUpload();

		yield put(execAsyncExportJobAction.FULLFILLED({}));
	} catch (error) {
		yield put(execAsyncExportJobAction.REJECTED());
	}
}

/// /////////// Watchers ///////////////////////
export function* watcherOwners() {
	yield takeLatest(GET_SHAPE_OWNERS_AND_COUNT.STARTED, getShapeOwnersAndCount);
	yield takeLatest(GET_SHAPE_OWNERS_AND_WELLS.STARTED, getShapeOwnersAndWells);
	yield takeLatest(GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.STARTED, getMapFilterShapeOwnersAndCount);
	yield takeLatest(GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS.STARTED, getMapFilterShapeOwnersAndWells);
	yield takeLatest(EXEC_ASYNC_EXPORT_JOB.STARTED, execAsyncExportJob);
}
