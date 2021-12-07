import { call, takeLatest, put } from 'redux-saga/effects';

import { TEST_SAGA } from './type';
import Api from './api';
import { GET_ES_DOCUMENTS } from "graphQL/useQueryESDocuments";

function* testSaga() {
  try {
    debugger
    console.log('testSaga');
    const data = yield call (Api.testSaga, GET_ES_DOCUMENTS, { pagination: { first: 25, keep_alive: "1micros" }, search: ""})

    debugger
  } catch (error) {
    debugger
  }
}


/// /////////// Watchers ///////////////////////
export function* watcherCommon() {
  yield takeLatest(TEST_SAGA, testSaga);
}
