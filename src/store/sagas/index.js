import { all } from "redux-saga/effects";
import { watcherOwners } from "store/sagas/ownerSaga";
import { watcherContacts } from "store/sagas/contactSaga";

export default function* rootSaga(getState) {
  yield all([
    watcherOwners(),
    watcherContacts()
  ]);
}
