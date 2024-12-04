import gql from 'graphql-tag';

export const CREATE_JOB = gql`
	mutation createJob($jobId: ID, $sendEmail: Boolean) {
		createJob(jobId: $jobId, sendEmail: $sendEmail)
	}
`;
