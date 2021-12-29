import { call, takeLatest, put } from "redux-saga/effects";

import Api from "api";
import { getSelectedFeaturePolygonString } from "utils/helper";
import { SHAPE_OWNERS } from "graphQL/useQueryPaginatedShapeOwners";
import { SHAPEOWNERSCOUNT } from "graphQL/useQueryShapeOwnersCount";
import { OWNERS_BY_WELL_IDS } from "graphQL/useQueryOwnersByWellIds";
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
        first: shapeOwnerCount?.data?.data?.shapeOwnersCount,
        after: null,
      },
    });
    yield put(
      getShapeOwnersAndCountAction.FULLFILLED({
        shapeOwners: shapeOwner?.data?.data?.paginatedShapeOwners?.edges,
        shapeCount: shapeOwnerCount?.data?.data?.shapeOwnersCount,
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
        first: wellsCount?.data?.data?.getESPaginatedList?.total,
        after: null,
      },
    });


    const wellIds = wells.data.data.getESPaginatedList.hits.map(
      (well) => well.Id
    );

    const taxOwners = yield call(Api.fetch, OWNERS_BY_WELL_IDS, {
      wellIds: wellIds,
      selectedYear: "2021",
    });


    yield put(
      getShapeOwnersAndWellsAction.FULLFILLED({
        shapeOwners: taxOwners?.data?.data?.ownersByWellIds,
        shapeCount: taxOwners?.data?.data?.ownersByWellIds?.length,
        wells: wells?.data?.data?.getESPaginatedList?.hits,
        wellsCount: wellsCount?.data?.data?.getESPaginatedList?.total,
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
        first: wellsCount?.data?.data?.getESPaginatedList?.total,
        after: null,
      },
    });
    const wellIds = wells.data.data.getESPaginatedList.hits.map(
      (well) => well.Id
    );

    const taxOwners = yield call(Api.fetch, OWNERS_BY_WELL_IDS, {
      wellIds: wellIds,
      selectedYear: "2021",
    });

    yield put(
      getMapFilterShapeOwnersAndCountAction.FULLFILLED({
        shapeOwners: taxOwners.data.data.ownersByWellIds,
        shapeCount: taxOwners.data.data.ownersByWellIds.length
      })
    );
  } catch (error) {
    yield put(getShapeOwnersAndCountAction.REJECTED());
  }
}

function* getMapFilterShapeOwnersAndWells(action) {
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
        first: wellsCount?.data?.data?.getESPaginatedList?.total,
        after: null,
      },
    });
    const wellIds = wells.data.data.getESPaginatedList.hits.map(
      (well) => well.Id
    );

    const taxOwners = yield call(Api.fetch, OWNERS_BY_WELL_IDS, {
      wellIds: wellIds,
      selectedYear: "2021",
    });

    yield put(
      getMapFilterShapeOwnersAndWellsAction.FULLFILLED({
        shapeOwners: taxOwners.data.data.ownersByWellIds,
        shapeCount: taxOwners.data.data.ownersByWellIds.length,
        wells: wells?.data?.data?.getESPaginatedList?.hits,
        wellsCount: wellsCount?.data?.data?.getESPaginatedList?.total,
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
