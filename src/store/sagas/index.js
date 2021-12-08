import { all } from "redux-saga/effects";
import { watcherCommon } from "store/sagas/sagaTest";

export default function* rootSaga(getState) {
  yield all([
    watcherCommon()
  ]);
}
