import gql from 'graphql-tag';

export const INITIALIZE_EXPORT_JOB = gql`
	mutation initializeExportJob($jobName: String, $jobType: JobType, $requestPayload: JSON, $userId: ID) {
		initializeExportJob(jobName: $jobName, jobType: $jobType, requestPayload: $requestPayload, userId: $userId)
	}
`;
