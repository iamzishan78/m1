import gql from "graphql-tag";

export const GET_JOBS_STATUS = gql`
  query getJobsStatus($userId: ID) {
    getJobsStatus(userId: $userId)
  }
`;
