import { TOGGLE_BULK_UPLOAD, EXEC_COMMON_ASYNC_EXPORT_JOB } from "store/type";

export const toggleBulkUploadAction = (payload) => ({
  type: TOGGLE_BULK_UPLOAD,
  payload,
});

export const execCommonAsyncExportJobAction = {
  STARTED: (payload) => ({
    type: EXEC_COMMON_ASYNC_EXPORT_JOB.STARTED,
    payload,
  }),
  FULLFILLED: (payload) => ({
    type: EXEC_COMMON_ASYNC_EXPORT_JOB.FULLFILLED,
    payload,
  }),
  REJECTED: () => ({ type: EXEC_COMMON_ASYNC_EXPORT_JOB.REJECTED }),
};
