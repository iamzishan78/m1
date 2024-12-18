import { call, takeLatest, put } from 'redux-saga/effects';

import Api from 'api';
import { GET_CURRENT_USER_GRID_VIEW_SETTINGS } from 'graphQL/useQueryGetCurrentUserGridViewSettings';
import { SET_CURRENT_USER_GRID_VIEW_MUTATION } from 'graphQL/useMutationSetCurrentUserGridView';
import { UPDATE_USER_GRID_VIEW_SETTING_MUTATION } from 'graphQL/useMutationUpdateUserGridViewSetting';
import {
	currentUserGridViewSettingsAction,
	setCurrentUserGridViewAction,
	updateUserGridViewSettingAction,
} from 'store/actions/sessionActions';
import { CURRENT_USER_GRID_VIEW_SETTINGS, SET_CURRENT_USER_GRID_VIEW, UPDATE_USER_GRID_VIEW_SETTING } from 'store/type';

function* currentUserGridViewSettings(action) {
	try {
		const res = yield call(
			Api.query,
			GET_CURRENT_USER_GRID_VIEW_SETTINGS,
			{
				userId: action.payload,
			},
			{
				fetchPolicy: 'no-cache',
			}
		);

		yield put(
			currentUserGridViewSettingsAction.FULLFILLED({
				userId: action.payload,
				userGridViewSettings: res?.data?.getCurrentUserGridViewSettings?.userGridViewSettings,
			})
		);
	} catch (error) {
		yield put(currentUserGridViewSettingsAction.REJECTED());
	}
}

function* setCurrentUserGridView(action) {
	try {
		const res = yield call(Api.mutate, SET_CURRENT_USER_GRID_VIEW_MUTATION, action.payload);

		// const effect = yield put(currentUserGridViewSettingsAction.STARTED(action.payload.userId));

		yield put(setCurrentUserGridViewAction.FULLFILLED(res?.data?.setCurrentUserGridView?.currentUserGridView));
	} catch (error) {
		yield put(setCurrentUserGridViewAction.REJECTED());
	}
}

function* updateUserGridViewSetting(action) {
	try {
		const res = yield call(Api.mutate, UPDATE_USER_GRID_VIEW_SETTING_MUTATION, action.payload);

		// const effect = yield put(currentUserGridViewSettingsAction.STARTED(action.payload.userId));

		yield put(updateUserGridViewSettingAction.FULLFILLED(res?.data?.updateUserGridViewSetting?.updatedUserGridView));
	} catch (error) {
		yield put(setCurrentUserGridViewAction.REJECTED());
	}
}

/// /////////// Watchers ///////////////////////
export function* watcherSession() {
	yield takeLatest(CURRENT_USER_GRID_VIEW_SETTINGS.STARTED, currentUserGridViewSettings);
	yield takeLatest(SET_CURRENT_USER_GRID_VIEW.STARTED, setCurrentUserGridView);
	yield takeLatest(UPDATE_USER_GRID_VIEW_SETTING.STARTED, updateUserGridViewSetting);
}
