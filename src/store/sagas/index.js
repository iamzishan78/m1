import { all } from 'redux-saga/effects';

import { watcherCommon } from 'store/sagas/commonSaga';
import { watcherContacts } from 'store/sagas/contactSaga';
import { watcherEntity } from 'store/sagas/entitySaga';
import { watcherOwners } from 'store/sagas/ownerSaga';
import { watcherSession } from 'store/sagas/sessionSaga';

export default function* rootSaga(getState) {
	yield all([watcherOwners(), watcherContacts(), watcherEntity(), watcherSession(), watcherCommon()]);
}
