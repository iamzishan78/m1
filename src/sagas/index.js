import { all } from "redux-saga/effects";
import { watcherCommon } from "./sagaTest";

export default function* rootSaga(getState) {
  yield all([
    watcherCommon()
  ]);
}
