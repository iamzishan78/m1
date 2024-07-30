import React, { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "AppContext";
import { useQuery, useApolloClient } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import { UPDATE_JOB } from "graphQL/useMutationUpdateJob";
import { GET_JOBS_STATUS } from "graphQL/useQueryGetJobStatus";
import Loader from "components/Loaders/serverLoader";
import { setReduxKey } from "store/actions/commonActions";
import useRefetchHelper from "components/Shared/Hooks/useRefetchHelper";
import { jobController } from "hookstate/jobStateController";
import { debounce } from "lodash";
import { tableGlobalController } from "hookstate/tableController";

const ContactBulkProgress = () => {
  const [stateApp] = useContext(AppContext);
  const bulkUpload = useSelector((state) => state.common.bulkUpload);
  const refetchHelper = useRefetchHelper()
  const refetchHelperDebounced = useMemo(() => debounce((requestPayload) => refetchHelper(requestPayload), 1000), []);
  const jobState = jobController.useState(
    ['bulkUpload', 'storeJobOutput'],
    'jobStateValues'
  );
  const { jobStateValues } = jobState

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
  }, [jobState.bulkUpload, bulkUpload]);

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

  // useEffect hook to run side-effects when `dataJobs?.getJobsStatus` changes
  useEffect(() => {
    // Check if there are jobs in dataJobs and storeJobOutput exists in jobStateValues
    if (dataJobs?.getJobsStatus?.jobs?.length > 0 && jobStateValues?.storeJobOutput) {
      // Find the target job output that matches the stored jobId
      const targetJobOutput = dataJobs.getJobsStatus.jobs.find(
        (job) => job._id === jobStateValues?.storeJobOutput?.jobId
      );
      // Update job state with the found job output
      jobController.updateState({ JobOutput: targetJobOutput?.jobOutput });
    }
  }, [dataJobs?.getJobsStatus]); // Dependency array to rerun the effect when dataJobs?.getJobsStatus changes


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

  // Function for creating and updated Job Toast
  const createOrUpdateToast = (state) => {
    const asyncOperations = ["commentsCreation"]; // Array of async operations

    // Loop through jobs
    for (let i = 0; i < dataJobs.getJobsStatus.jobs.length; i++) {
      let progress = 0; // Initialize progress
      // Extract job status, progress, totalProgress, requestPayload, and activitiesStatus
      const { status, progress: jobProgress, totalProgress, requestPayload, activitiesStatus } = dataJobs.getJobsStatus.jobs[i];
      // Extract lastMessage from activitiesStatus
      const lastMessage = activitiesStatus[activitiesStatus.length - 1];

      // Calculate progress percentage if jobProgress and totalProgress are available
      if (jobProgress && totalProgress) {
        progress = (jobProgress / totalProgress) * 100;
      }

      let message = ""; // Initialize message

      // Determine message based on job status
      if (status === "Started" || status === "Pending") {
        message = lastMessage; // Use last message for started or pending status
      } else if (status === "Completed" && requestPayload?.async) {
        if (requestPayload.refetch)
          refetchHelperDebounced(requestPayload.refetch); // Debounced refetch if async operation is completed
        message = lastMessage; // Use last message for completed async operation
      } else {
        if (status === "Completed")
          dispatch(setReduxKey("contactsAdded", true)) // Dispatch action if status is completed
        const type = dataJobs.getJobsStatus.jobs[i].type; // Extract job type

        // Determine message for different job types
        if (type === 'contacts') {
          message = status === "Created" ? "Waiting for job to start" : status === "Completed" ? "Contacts creation completed" : "Contacts creation failed";
        } else if (type === 'PROPERTIES') {
          message = status === "Created" ? "Waiting for job to start" : status === "Completed" ? "Import successfully completed" : "Import Failed";
        } else {
          const labelType = ['checkDetails'].includes(type) ? 'Import' : 'Export'; // Determine label type based on job type

          // Determine message for general job types
          if (status === 'Created') {
            message = 'Waiting for job to start';
          } else if (status === 'Completed') {
            message = `${asyncOperations.includes(type) ? 'Async operation' : labelType} successfully completed`;
          } else if (status === 'Completed with errors') {
            message = `${asyncOperations.includes(type) ? 'Async operation' : labelType} completed with errors`;
          } else {
            message = `${asyncOperations.includes(type) ? 'Async operation' : labelType} Failed`;
          }

          // Additional action for specific job type and status
          if (
            type === 'SHAPEOWNER' &&
            (status === 'Completed' || status.includes('Completed'))
          )
            refetchHelper(['getCustomLayer']);
        }
        if (status === 'Completed with errors') message = status; // Update message for completed with errors status
      }

      // Create or update toast based on state
      if (state === "create") {
        if (status !== "Completed" && status !== "Failed") {
          Loader.createToast(dataJobs.getJobsStatus.jobs[i]._id, message, progress, onCloseToast);
        }
      } else {
        if (status === "Completed" || status === "Completed with errors") {
          Loader.successToast(dataJobs.getJobsStatus.jobs[i]._id, message, onCloseToast);
          downloadResults(dataJobs.getJobsStatus.jobs[i], onCloseToast);
          if (dataJobs.getJobsStatus.jobs[i].type === "contacts")
            refetchQueryByName("checkIfOwnersAreContacts");
          // Refetch when its the status is completed for the last job iteration
          if(i === dataJobs.getJobsStatus.jobs.length - 1) {
            const { progress: jobProgress, totalProgress } = dataJobs.getJobsStatus.jobs[i];
            // Check if the current progress is equal to the total progress
            if(jobProgress === totalProgress) {
              tableGlobalController.refetch();
            }
          }
        } else if (status === "Failed") {
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
