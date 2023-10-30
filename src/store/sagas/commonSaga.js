import { takeLatest, put } from "redux-saga/effects";

import { INITIALIZE_EXPORT_JOB } from "graphQL/useMutationinitializeExportJob";
import { CREATE_JOB } from "graphQL/useMutationCreateJob";
import { execCommonAsyncExportJobAction } from "store/actions/commonActions";
import { EXEC_COMMON_ASYNC_EXPORT_JOB } from "store/type";
import { jobController } from "hookstate/jobStateController";

function* execCommonAsyncExportJob(action) {
  try {
    const { jobType, requestPayload, setStateApp, userId, client } = action.payload;
    const jobInitialization = yield client.mutate({
      mutation: INITIALIZE_EXPORT_JOB,
      variables: {
        jobName: "Export",
        jobType: jobType,
        requestPayload,
        userId,
      },
    });

    yield client.mutate({
      mutation: CREATE_JOB,
      variables: {
        jobId: jobInitialization?.data?.initializeExportJob?.job?._id,
        sendEmail: false,
      },
    });

    jobController.toggleBulkUpload()

    yield put(execCommonAsyncExportJobAction.FULLFILLED({}));
  } catch (error) {
    yield put(execCommonAsyncExportJobAction.REJECTED());
  }
}

/// /////////// Watchers ///////////////////////
export function* watcherCommon() {
  yield takeLatest(EXEC_COMMON_ASYNC_EXPORT_JOB.STARTED, execCommonAsyncExportJob);
}
