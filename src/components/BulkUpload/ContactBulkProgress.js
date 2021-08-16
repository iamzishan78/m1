import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "AppContext";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";

import { UPDATE_JOB } from "graphQL/useMutationUpdateJob";
import { GET_JOBS_STATUS } from "graphQL/useQueryGetJobStatus";
import Loader from "components/Loaders/serverLoader";

const ContactBulkProgress = () => {
    const [stateApp] = useContext(AppContext);
    const [pollingStarted,  setPollingStarted] = useState(false);
  
    const [updateJob, { data: updatedJob }] = useMutation(UPDATE_JOB);

    const { data: dataJobs,  startPolling, stopPolling, refetch } = useQuery(GET_JOBS_STATUS, { variables: { userId: stateApp.user?.mongoId, showProgress: true} });
  
    useEffect(() => {
        setPollingStarted(false)
        stopPolling()
        refetch()
    },[stateApp.bulkUpload])

    useEffect(() => {
      if(dataJobs?.getJobsStatus?.jobs?.length > 0){
        const pendingJobs = dataJobs.getJobsStatus.jobs.find(job => (job.status === 'Created'|| job.status === 'Pending' || job.status === 'Started'))
        if(pendingJobs && !pollingStarted){
          startPolling(3000);
          setPollingStarted(true)
          createOrUpdateToast('create')
        }else{
          if(!pendingJobs){
            stopPolling()
          }
          createOrUpdateToast('update')
        }
      }else{
        stopPolling()
      }
    },[dataJobs?.getJobsStatus])

    const onCloseToast = (jobId) => {
      updateJob({
        variables: {
          job:{
            _id: jobId,
            closeToast: true,
          }
        }
      })
    }  
  
    const createOrUpdateToast = (state) => {
      for(let i = 0; i < dataJobs.getJobsStatus.jobs.length; i++){
        let progress = 0;
        if(dataJobs.getJobsStatus.jobs[i].progress && dataJobs.getJobsStatus.jobs[i].totalProgress){
          progress = (dataJobs.getJobsStatus.jobs[i].progress / dataJobs.getJobsStatus.jobs[i].totalProgress) * 100;
        }
        let message = ''
        if(dataJobs.getJobsStatus.jobs[i].status === 'Started' ||  dataJobs.getJobsStatus.jobs[i].status === 'Pending'){
          message = dataJobs.getJobsStatus.jobs[i].activitiesStatus[dataJobs.getJobsStatus.jobs[i].activitiesStatus.length - 1];
        }else{
          const status = dataJobs.getJobsStatus.jobs[i].status
          message = status === 'Created' ? 'Waiting for job to start' : status === 'Completed' ? 'Process Completed' : 'Process Failed';
        }
  
        if(state === 'create'){
          if(dataJobs.getJobsStatus.jobs[i].status !== 'Completed' && dataJobs.getJobsStatus.jobs[i].status !== 'Failed'){
            Loader.createToast(dataJobs.getJobsStatus.jobs[i]._id, message, progress, onCloseToast)  
          }
        }else{
          if(dataJobs.getJobsStatus.jobs[i].status === 'Completed'){
            Loader.successToast(dataJobs.getJobsStatus.jobs[i]._id, message, onCloseToast)
          }
          else if(dataJobs.getJobsStatus.jobs[i].status === 'Failed'){
            Loader.errorToast(dataJobs.getJobsStatus.jobs[i]._id, message, onCloseToast)
          }else{
            Loader.updateToast(dataJobs.getJobsStatus.jobs[i]._id, message, progress)
          }
        }
      }
    }
  
    return (
      <div>
      </div>
    );
  };

export default ContactBulkProgress