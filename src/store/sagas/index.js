import { all } from 'redux-saga/effects';
import { watcherOwners } from 'store/sagas/ownerSaga';
import { watcherContacts } from 'store/sagas/contactSaga';
import { watcherEntity } from 'store/sagas/entitySaga';
import { watcherSession } from 'store/sagas/sessionSaga';
import { watcherCommon } from 'store/sagas/commonSaga';

export default function* rootSaga(getState) {
	yield all([watcherOwners(), watcherContacts(), watcherEntity(), watcherSession(), watcherCommon()]);
}
