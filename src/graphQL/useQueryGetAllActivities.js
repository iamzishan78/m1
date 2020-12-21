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
      dealName
      type
      ownerName
      contactName
      name
      isClosed
    }
  }
`;

export const GETALLACTIVITIESFORSEARCH = gql`
  query getAllActivitiesForSearch {
    activities {
      _id
      name
      type
    }
  }
`;
