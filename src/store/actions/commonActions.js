import { TOGGLE_BULK_UPLOAD, TOGGLE_QUICK_ACTIONS_PANEL, SET_ACTIVE_MODULE, SET_REDUX_KEY } from 'store/type';

export const toggleBulkUploadAction = (payload) => ({ type: TOGGLE_BULK_UPLOAD, payload })

export const toggleQuickActionsPanel = (state) => ({
    type: TOGGLE_QUICK_ACTIONS_PANEL,
    payload: state,
});

export const setActiveModule = (payload) => {
    return {
        type: SET_ACTIVE_MODULE,
        payload,
    };
};

export const setReduxKey = (key, value) => ({
    type: SET_REDUX_KEY,
    payload: { key, value }
});
