import { call, takeLatest, put } from 'redux-saga/effects';
import get from 'lodash/get';

import Api from 'api';
import { GET_ENTITY } from 'graphQL/useQueryGetEntity';
import { OWNER_BY_ID_QUERY } from 'graphQL/useQueryOwners';
import { getOwnerEntityDetailAction } from 'store/actions/entityActions';
import { GET_OWNER_ENTITY_DETAILS } from 'store/type';

function* getOwnerEntityDetail(action) {
	try {
		const entity = get(
			yield call(Api.query, GET_ENTITY, {
				entityId: action.payload,
			}),
			'data.getEntity.entity',
			null
		);
		if (entity.globalOwner) {
			const owner = get(
				yield call(Api.query, OWNER_BY_ID_QUERY, {
					id: entity.globalOwner,
				}),
				'data.owner',
				null
			);
			yield put(getOwnerEntityDetailAction.FULLFILLED({ ...owner, globalOwnerId: owner.globalOwner, isEntity: false }));
		} else {
			yield put(getOwnerEntityDetailAction.FULLFILLED({ ...entity, isEntity: true }));
		}
	} catch (error) {
		yield put(getOwnerEntityDetailAction.REJECTED());
	}
}

/// /////////// Watchers ///////////////////////
export function* watcherEntity() {
	yield takeLatest(GET_OWNER_ENTITY_DETAILS.STARTED, getOwnerEntityDetail);
}
