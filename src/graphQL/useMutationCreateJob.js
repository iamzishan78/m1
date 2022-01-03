import gql from "graphql-tag";

export const CREATE_JOB = gql`
  mutation createJob($jobId: String, $sendEmail: Boolean) {
    createJob(jobId: $jobId, sendEmail: $sendEmail)
  }
`;
