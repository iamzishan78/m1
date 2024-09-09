import gql from "graphql-tag";

export const GET_CONTACTS_FOR_ACTIVITY = gql`
  query getContactsForActivity ($activityId: ID) {
    getContactsForActivity(activityId: $activityId)
  }
`;
