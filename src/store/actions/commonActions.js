import {
	UPDATE_PIN_COMMENTS,
	TOGGLE_QUICK_ACTIONS_PANEL,
	SET_ACTIVE_MODULE,
	SET_REDUX_KEY,
	TOGGLE_BULK_UPLOAD,
	EXEC_COMMON_ASYNC_EXPORT_JOB,
} from 'store/type';

export const toggleBulkUploadAction = payload => ({ type: TOGGLE_BULK_UPLOAD, payload });

export const toggleQuickActionsPanel = state => ({
	type: TOGGLE_QUICK_ACTIONS_PANEL,
	payload: state,
});

export const setActiveModule = payload => {
	return {
		type: SET_ACTIVE_MODULE,
		payload,
	};
};

export const setReduxKey = (key, value) => ({
	type: SET_REDUX_KEY,
	payload: { key, value },
});

export const execCommonAsyncExportJobAction = {
	STARTED: payload => ({
		type: EXEC_COMMON_ASYNC_EXPORT_JOB.STARTED,
		payload,
	}),
	FULLFILLED: payload => ({
		type: EXEC_COMMON_ASYNC_EXPORT_JOB.FULLFILLED,
		payload,
	}),
	REJECTED: () => ({ type: EXEC_COMMON_ASYNC_EXPORT_JOB.REJECTED }),
};
export const updatePinComments = newCommentList => {
	return {
		type: UPDATE_PIN_COMMENTS,
		payload: newCommentList,
	};
};
