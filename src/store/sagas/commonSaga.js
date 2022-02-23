import { takeLatest, put, select } from "redux-saga/effects";

import { INITIALIZE_EXPORT_JOB } from "graphQL/useMutationinitializeExportJob";
import { CREATE_JOB } from "graphQL/useMutationCreateJob";
import { execCommonAsyncExportJobAction } from "store/actions/commonActions";
import { EXEC_COMMON_ASYNC_EXPORT_JOB } from "store/type";

function* execCommonAsyncExportJob(action) {
  try {
    const { client, currentFeature, userId, exportWells, exportOwners, exportOwnersInterest, setStateApp } = action.payload;
    debugger
    // const jobInitialization = yield client.mutate({
    //   mutation: INITIALIZE_EXPORT_JOB,
    //   variables: {
    //     jobName: "Shape Export",
    //     jobType: "SHAPEEXPORT",
    //     requestPayload: {
    //       polygon: currentFeature?.geometry,
    //       filters: ownerState.filters,
    //       search: ownerState.search,
    //       datasets: {
    //         exportWells,
    //         exportOwners,
    //         exportOwnersInterest,
    //       },
    //       counts: {
    //         exportWells: ownerState.wellsCount,
    //         exportOwners: ownerState.shapeCount,
    //         exportOwnersInterest: ownerState.shapeInterestCount,
    //       },
    //     },
    //     userId,
    //   },
    // });

    // yield client.mutate({
    //   mutation: CREATE_JOB,
    //   variables: {
    //     jobId: jobInitialization?.data?.initializeExportJob?.job?._id,
    //     sendEmail: false,
    //   },
    // });

    // setStateApp((state) => ({
    //   ...state,
    //   bulkUpload: !state.bulkUpload,
    // }));

    // yield put(execAsyncExportJobAction.FULLFILLED({}));
  } catch (error) {
    yield put(execCommonAsyncExportJobAction.REJECTED());
  }
}

/// /////////// Watchers ///////////////////////
export function* watcherCommon() {
  yield takeLatest(EXEC_COMMON_ASYNC_EXPORT_JOB.STARTED, execCommonAsyncExportJob);
}
