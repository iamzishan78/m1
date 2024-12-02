import gql from 'graphql-tag';

export const GET_JOB_UPLOAD_URI = gql`
	query getJobUploadUri($jobName: String, $jobType: JobType, $userId: String, $requestPayload: JSON) {
		getJobUploadUri(jobName: $jobName, jobType: $jobType, userId: $userId, requestPayload: $requestPayload)
	}
`;
