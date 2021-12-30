import { call, takeLatest, put } from "redux-saga/effects";
import get from 'lodash/get';

import Api from "api";
import { getSelectedFeaturePolygonString } from "utils/helper";
import { SHAPE_OWNERS } from "graphQL/useQueryPaginatedShapeOwners";
import { SHAPEOWNERSCOUNT } from "graphQL/useQueryShapeOwnersCount";
import {
  OWNERS_BY_WELL_IDS,
  OWNERS_INTEREST_BY_WELL_IDS,
} from "graphQL/useQueryOwnersByWellIds";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import {
  getShapeOwnersAndCountAction,
  getShapeOwnersAndWellsAction,
  getMapFilterShapeOwnersAndWellsAction,
  getMapFilterShapeOwnersAndCountAction,
} from "store/actions/ownerActions";
import {
  GET_SHAPE_OWNERS_AND_WELLS,
  GET_SHAPE_OWNERS_AND_COUNT,
  GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS,
  GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT,
} from "store/type";

function* getShapeOwnersAndCount(action) {
  try {
    const { currentFeature, userId } = action.payload;
    const polygon = getSelectedFeaturePolygonString(currentFeature);
    const shapeOwnerCount = yield call(Api.fetch, SHAPEOWNERSCOUNT, {
      polygon,
    });

    const shapeOwner = yield call(Api.fetch, SHAPE_OWNERS, {
      polygon,
      userId,
      pagination: {
        first: get(shapeOwnerCount, 'data.data.shapeOwnersCount', 0),
        after: null,
      },
    });

    yield put(
      getShapeOwnersAndCountAction.FULLFILLED({
        shapeOwners: get(shapeOwner, 'data.data.paginatedShapeOwners.edges', []),
        shapeCount: get(shapeOwnerCount, 'data.data.shapeOwnersCount', 0)
      })
    );
  } catch (error) {
    yield put(getShapeOwnersAndCountAction.REJECTED());
  }
}

function* getShapeOwnersAndWells(action) {
  try {
    const { currentFeature, userId } = action.payload;

    const wellsCount = yield call(Api.fetch, GET_ES_PAGINATED_LIST, {
      esIndex: "platformData:wells",
      polygon: currentFeature?.geometry?.coordinates[0],
      pagination: {
        first: 0,
        after: null,
      },
    });

    const wells = yield call(Api.fetch, GET_ES_PAGINATED_LIST, {
      esIndex: "platformData:wells",
      polygon: currentFeature?.geometry?.coordinates[0],
      pagination: {
        first: get(wellsCount,'data.data.getESPaginatedList.total', 0),
        after: null,
      },
    });

    const wellIds = get(wells, 'data.data.getESPaginatedList.hits',[]).map(
      (well) => well.Id
    );

    let taxOwners = [];
    let taxOwnersInterest = [];

    if(wellIds?.length > 0){
      taxOwnersInterest = yield call(Api.fetch, OWNERS_INTEREST_BY_WELL_IDS, {
        wellIds: wellIds,
        selectedYear: "2021",
      });
  
      taxOwners = yield call(Api.fetch, OWNERS_BY_WELL_IDS, {
        wellIds: wellIds,
        selectedYear: "2021",
      });
    }
    
    yield put(
      getShapeOwnersAndWellsAction.FULLFILLED({
        shapeOwners: get(taxOwners, 'data.data.ownersByWellIds',[]),
        shapeCount: get(taxOwners, 'data.data.ownersByWellIds.length',0),
        shapeOwnersInterest: get(taxOwnersInterest, 'data.data.ownersInterestByWellIds',0),
        shapeInterestCount: get(taxOwnersInterest, 'data.data.ownersInterestByWellIds.length',[]),
        wells: get(wells, 'data.data.getESPaginatedList.hits', []),
        wellsCount: get(wellsCount, 'data.data.getESPaginatedList.total', 0),
      })
    );
  } catch (error) {
    yield put(getShapeOwnersAndWellsAction.REJECTED());
  }
}

function* getMapFilterShapeOwnersAndCount(action) {
  try {
    const { currentFeature, filters, search, userId } = action.payload;

    const wellsCount = yield call(Api.fetch, GET_ES_PAGINATED_LIST, {
      esIndex: "platformData:wells",
      search,
      filters,
      polygon: currentFeature?.geometry?.coordinates[0],
      pagination: {
        first: 0,
        after: null,
      },
    });

    const wells = yield call(Api.fetch, GET_ES_PAGINATED_LIST, {
      esIndex: "platformData:wells",
      search,
      filters,
      polygon: currentFeature?.geometry?.coordinates[0],
      pagination: {
        first: get(wellsCount, 'data.data.getESPaginatedList.total', 0),
        after: null,
      },
    });
    const wellIds = get(wells, 'data.data.getESPaginatedList.hits',[]).map(
      (well) => well.Id
    );

    let taxOwners = [];

    if(wellIds?.length > 0){
      taxOwners = yield call(Api.fetch, OWNERS_BY_WELL_IDS, {
        wellIds: wellIds,
        selectedYear: "2021",
      });
    }

    yield put(
      getMapFilterShapeOwnersAndCountAction.FULLFILLED({
        shapeOwners: get(taxOwners, 'data.data.ownersByWellIds', []),
        shapeCount: get(taxOwners, 'data.data.ownersByWellIds.length', 0),
      })
    );
  } catch (error) {
    yield put(getShapeOwnersAndCountAction.REJECTED());
  }
}

function* getMapFilterShapeOwnersAndWells(action) {
  try {
    const { currentFeature, filters, search, userId } =
      action.payload;

    const wellsCount = yield call(Api.fetch, GET_ES_PAGINATED_LIST, {
      esIndex: "platformData:wells",
      search,
      filters,
      polygon: currentFeature?.geometry?.coordinates[0],
      pagination: {
        first: 0,
        after: null,
      },
    });

    const wells = yield call(Api.fetch, GET_ES_PAGINATED_LIST, {
      esIndex: "platformData:wells",
      search,
      filters,
      polygon: currentFeature?.geometry?.coordinates[0],
      pagination: {
        first: get(wellsCount, 'data.data.getESPaginatedList.total', 0),
        after: null,
      },
    });

    const wellIds = get(wells, 'data.data.getESPaginatedList.hits',[]).map(
      (well) => well.Id
    );

    let taxOwners = [];
    let taxOwnersInterest = [];

    if(wellIds?.length > 0){
      taxOwnersInterest = yield call(Api.fetch, OWNERS_INTEREST_BY_WELL_IDS, {
        wellIds: wellIds,
        selectedYear: "2021",
      });

      taxOwners = yield call(Api.fetch, OWNERS_BY_WELL_IDS, {
        wellIds: wellIds,
        selectedYear: "2021",
      });
    }

    yield put(
      getMapFilterShapeOwnersAndWellsAction.FULLFILLED({
        shapeOwners: get(taxOwners, 'data.data.ownersByWellIds',[]),
        shapeCount: get(taxOwners, 'data.data.ownersByWellIds.length',0),
        shapeOwnersInterest: get(taxOwnersInterest, 'data.data.ownersInterestByWellIds',0),
        shapeInterestCount: get(taxOwnersInterest, 'data.data.ownersInterestByWellIds.length',[]),
        wells: get(wells, 'data.data.getESPaginatedList.hits',[]),
        wellsCount: get(wellsCount, 'data.data.getESPaginatedList.total',0),
      })
    );
  } catch (error) {
    yield put(getMapFilterShapeOwnersAndWellsAction.REJECTED());
  }
}

/// /////////// Watchers ///////////////////////
export function* watcherOwners() {
  yield takeLatest(GET_SHAPE_OWNERS_AND_COUNT.STARTED, getShapeOwnersAndCount);
  yield takeLatest(GET_SHAPE_OWNERS_AND_WELLS.STARTED, getShapeOwnersAndWells);
  yield takeLatest(
    GET_MAP_FILTER_SHAPE_OWNERS_AND_COUNT.STARTED,
    getMapFilterShapeOwnersAndCount
  );
  yield takeLatest(
    GET_MAP_FILTER_SHAPE_OWNERS_AND_WELLS.STARTED,
    getMapFilterShapeOwnersAndWells
  );
}
