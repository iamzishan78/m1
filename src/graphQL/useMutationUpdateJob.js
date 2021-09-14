import gql from "graphql-tag";

export const UPDATE_JOB = gql`
  mutation updateJob($job: jobInput) {
    updateJob(job: $job)
  }
`;
