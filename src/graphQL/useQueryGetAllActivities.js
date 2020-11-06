import gql from "graphql-tag";

export const GETALLACTIVITIES = gql`
  query getAllActivities {
    activities {
      fullname
      dateTime
      endDateTime
      notes
      type
    }
  }
`;
