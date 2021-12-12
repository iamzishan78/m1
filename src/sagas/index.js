import { all } from "redux-saga/effects";
////Example:////   import authSagas from "./Auth";

export default function* rootSaga(getState) {
  yield all([
    ////Example:////   authSagas(),
  ]);
}
