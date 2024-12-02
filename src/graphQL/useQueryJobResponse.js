import gql from 'graphql-tag';

export const JOB_RESPONSE = gql`
	query getJobResponse($jobId: ID) {
		getJobResponse(jobId: $jobId)
	}
`;
