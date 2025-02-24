import gql from "graphql-tag";

export const BULK_ADD_ACTIVITIES = gql`
  mutation bulkAddActivities($activity: JSON!, $contacts: [JSON]!, $userId: ID!) {
    bulkAddActivities(activity: $activity, contacts: $contacts,userId:$userId)
  }
`;
