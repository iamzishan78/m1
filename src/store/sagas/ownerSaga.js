import { call, takeLatest, put } from 'redux-saga/effects';

import Api from 'api';
import { GET_SHAPE_OWNERS_AND_COUNT } from 'store/type';
import { getSelectedFeaturePolygonString } from 'utils/helper'
import { SHAPE_OWNERS } from "graphQL/useQueryPaginatedShapeOwners";
import { SHAPEOWNERSCOUNT } from "graphQL/useQueryShapeOwnersCount";
import { getShapeOwnersAndCountAction } from 'store/actions/ownerActions';


function* getShapeOwnersAndCount(action) {
  try {
    const { currentFeature, userId } = action.payload
    const polygon = getSelectedFeaturePolygonString(currentFeature);
    const shapeOwner = yield call (Api.fetch, SHAPE_OWNERS, { polygon, userId })
    const shapeOwnerCount = yield call (Api.fetch, SHAPEOWNERSCOUNT, { polygon })
    yield put (getShapeOwnersAndCountAction.FULLFILLED({ 
      shapeOwners: shapeOwner?.data?.data?.paginatedShapeOwners?.edges, 
      shapeCount: shapeOwnerCount?.data?.data?.shapeOwnersCount 
    }))
  } catch (error) {
    yield put (getShapeOwnersAndCountAction.REJECTED())
  }
}
/// /////////// Watchers ///////////////////////
export function* watcherOwners() {
  yield takeLatest(GET_SHAPE_OWNERS_AND_COUNT.STARTED, getShapeOwnersAndCount);
}