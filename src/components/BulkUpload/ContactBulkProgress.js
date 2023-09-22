import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "AppContext";
import { useQuery, useApolloClient } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import { UPDATE_JOB } from "graphQL/useMutationUpdateJob";
import { GET_JOBS_STATUS } from "graphQL/useQueryGetJobStatus";
import Loader from "components/Loaders/serverLoader";
import { setReduxKey } from "store/actions/commonActions";
import useRefetchHelper from "components/Shared/Hooks/useRefetchHelper";

const ContactBulkProgress = () => {
  const [stateApp] = useContext(AppContext);
  const bulkUpload = useSelector((state) => state.common.bulkUpload);
  const refetchHelper = useRefetchHelper()

  const dispatch = useDispatch();

  const [pollingStarted, setPollingStarted] = useState(false);

  const [updateJob, { data: updatedJob }] = useMutation(UPDATE_JOB, {
    refetchQueries: [GET_JOBS_STATUS]
  });

  const {
    data: dataJobs,
    startPolling,
    stopPolling,
    refetch,
  } = useQuery(GET_JOBS_STATUS, {
    variables: { userId: stateApp.user?.mongoId, showProgress: true },
    skip: stateApp.user?.mongoId ? false : true,
  });

  const client = useApolloClient();

  const findQueries = (manager, name) => {
    const matching = []
    manager.queries.forEach((q) => {
      if (q.observableQuery && (q.observableQuery.queryName === name)) {
        matching.push(q)
      }
    })
    return matching
  }

  const refetchQueryByName = (name) => {
    return Promise.all(findQueries(client.queryManager, name).map(q => q.observableQuery.refetch()))
  }

  useEffect(() => {
    if (stateApp.user) {
      setPollingStarted(false);
      stopPolling();
      refetch();
    }
  }, [stateApp.bulkUpload, bulkUpload]);

  useEffect(() => {
    if (dataJobs?.getJobsStatus?.jobs?.length > 0) {
      const pendingJobs = dataJobs.getJobsStatus.jobs.find(
        (job) => job.status === "Created" || job.status === "Pending" || job.status === "Started"
      );

      if (pendingJobs && !pollingStarted) {
        startPolling(3000);
        setPollingStarted(true);
        createOrUpdateToast("create");
      } else {
        if (!pendingJobs) {
          stopPolling();
        }
        createOrUpdateToast("update");
      }
    } else {
      stopPolling();
    }
  }, [dataJobs?.getJobsStatus]);

  const onCloseToast = (jobId) => {
    updateJob({
      variables: {
        job: {
          _id: jobId,
          closeToast: true,
        },
      },
    });
  };

  const downloadResults = async (job, onCloseToast) => {
    if (job?.resultsPayload?.datasets) {
      for (const dataset of job?.resultsPayload?.datasets) {
        // job?.resultsPayload?.datasets.map(async (dataset) => {
        let a = document.createElement("a");
        a.href = dataset.uri;
        a.download = dataset.fileName;
        a.click();

        await new Promise((resolve) => setTimeout(resolve, 1 * 2000));
      }
      onCloseToast(job._id);
    }
  };

  const createOrUpdateToast = (state) => {
    const asyncOperations = ["commentsCreation"];

    for (let i = 0; i < dataJobs.getJobsStatus.jobs.length; i++) {
      let progress = 0;
      if (dataJobs.getJobsStatus.jobs[i].progress && dataJobs.getJobsStatus.jobs[i].totalProgress) {
        progress = (dataJobs.getJobsStatus.jobs[i].progress / dataJobs.getJobsStatus.jobs[i].totalProgress) * 100;
      }
      let message = "";
      if (dataJobs.getJobsStatus.jobs[i].status === "Started" || dataJobs.getJobsStatus.jobs[i].status === "Pending") {
        message = dataJobs.getJobsStatus.jobs[i].activitiesStatus[dataJobs.getJobsStatus.jobs[i].activitiesStatus.length - 1];
      } else {
        const status = dataJobs.getJobsStatus.jobs[i].status;
        if (status === "Completed")
          dispatch(setReduxKey("contactsAdded", true))
        const type = dataJobs.getJobsStatus.jobs[i].type;
        if (type === 'contacts') {
          message = status === "Created" ? "Waiting for job to start" : status === "Completed" ? "Contacts creation completed" : "Contacts creation failed";
        } else if (type === 'PROPERTIES') {
          message = status === "Created" ? "Waiting for job to start" : status === "Completed" ? "Import successfully completed" : "Import Failed";
        }
        else {
          if (status === 'Created') {
            message = 'Waiting for job to start';
          } else if (status === 'Completed') {
            message = `${asyncOperations.includes(type) ? 'Async Operation' : 'Export'} successfully completed`;
          } else if (status === 'Completed with errors') {
            message = `${asyncOperations.includes(type) ? 'Async Operation' : 'Export'} completed with errors`;
          } else {
            message = `${asyncOperations.includes(type) ? 'Async Operation' : 'Export'} Failed`;
          }

          if (
            type === 'SHAPEOWNER' &&
            (status === 'Completed' || status.includes('Completed'))
          )
            refetchHelper(['getCustomLayer']);
        }
        if (status === 'Completed with errors') message = status
      }

      if (state === "create") {
        if (dataJobs.getJobsStatus.jobs[i].status !== "Completed" && dataJobs.getJobsStatus.jobs[i].status !== "Failed") {
          Loader.createToast(dataJobs.getJobsStatus.jobs[i]._id, message, progress, onCloseToast);
        }
      } else {
        if (dataJobs.getJobsStatus.jobs[i].status === "Completed" || dataJobs.getJobsStatus.jobs[i].status === "Completed with errors") {
          Loader.successToast(dataJobs.getJobsStatus.jobs[i]._id, message, onCloseToast);
          downloadResults(dataJobs.getJobsStatus.jobs[i], onCloseToast);
          if (dataJobs.getJobsStatus.jobs[i].type === "contacts")
            refetchQueryByName("checkIfOwnersAreContacts");
        } else if (dataJobs.getJobsStatus.jobs[i].status === "Failed") {
          Loader.errorToast(dataJobs.getJobsStatus.jobs[i]._id, message, onCloseToast);
        } else {
          Loader.updateToast(dataJobs.getJobsStatus.jobs[i]._id, message, progress);
        }
      }
    }
  };

  return <div></div>;
};

export default ContactBulkProgress;
