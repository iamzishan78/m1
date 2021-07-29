import gql from "graphql-tag";

export const CREATE_JOB = gql`
  mutation createJob($jobId: String) {
    createJob(jobId: $jobId)
  }
`;
