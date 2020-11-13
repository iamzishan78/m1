import gql from "graphql-tag";

export const GETALLACTIVITIES = gql`
  query getAllActivities {
    activities {
      _id
      contactId
      fullname
      dateTime
      endDateTime
      notes
      type
    }
  }
`;
