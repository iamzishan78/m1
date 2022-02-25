import { call, takeLatest, put } from "redux-saga/effects";
import get from "lodash/get";

import Api from "api";
import { GET_CURRENT_USER_GRID_VIEW_SETTINGS } from "graphQL/useQueryGetCurrentUserGridViewSettings";
import { SET_CURRENT_USER_GRID_VIEW_MUTATION } from "graphQL/useMutationSetCurrentUserGridView";
import {
  currentUserGridViewSettingsAction,
  setCurrentUserGridViewAction
} from "store/actions/sessionActions";
import { 
  CURRENT_USER_GRID_VIEW_SETTINGS,
  SET_CURRENT_USER_GRID_VIEW
} from "store/type";

function* currentUserGridViewSettings(action) {
  try {
    const res = 
      yield call(Api.query, GET_CURRENT_USER_GRID_VIEW_SETTINGS, {
        userId: action.payload,
      },
      {
        fetchPolicy: "no-cache",
      })

    yield put(
        currentUserGridViewSettingsAction.FULLFILLED({ 
          userId: action.payload,
          userGridViewSettings: res?.data?.getCurrentUserGridViewSettings?.userGridViewSettings
        })
    );
  } catch (error) {
    yield put(currentUserGridViewSettingsAction.REJECTED());
  }
}

function* setCurrentUserGridView(action) {
  try {
    const res = 
      yield call(Api.mutate, SET_CURRENT_USER_GRID_VIEW_MUTATION, action.payload)

    const effect = yield put(currentUserGridViewSettingsAction.STARTED(action.payload.userId));

    yield put(
      setCurrentUserGridViewAction.FULLFILLED(res?.data?.setCurrentUserGridView?.currentUserGridView)
    );
  } catch (error) {
    yield put(setCurrentUserGridViewAction.REJECTED());
  }
}

/// /////////// Watchers ///////////////////////
export function* watcherSession() {
  yield takeLatest(CURRENT_USER_GRID_VIEW_SETTINGS.STARTED, currentUserGridViewSettings);
  yield takeLatest(SET_CURRENT_USER_GRID_VIEW.STARTED, setCurrentUserGridView)
}
