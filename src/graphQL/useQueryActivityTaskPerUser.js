import gql from "graphql-tag";

export const GET_ACTIVITY_TASK_PER_USER = gql`
  query getActivityTaskPerUser($search: esSearchInput, $filters: [esFilterInput]) {
    getActivityTaskPerUser(
      search: $search,
      filters: $filters,
    )
  }
`;
