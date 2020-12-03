import gql from "graphql-tag";

export const GETALLACTIVITIES = gql`
  query getAllActivities {
    activities {
      _id
      dateTime
      endDateTime
      notes
      ownerId
      contactId
      dealId
      type
      ownerName
      contactName
      name
      isClosed
    }
  }
`;
