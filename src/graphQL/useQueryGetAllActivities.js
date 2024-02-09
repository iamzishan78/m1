import gql from "graphql-tag";

export const GETALLACTIVITIES = gql`
  query getAllActivities($category: String) {
    activities(category: $category) {
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
      createBy
      lastUpdateBy
      outcome
    }
  }
`;

export const GETALLACTIVITIESFORSEARCH = gql`
  query getAllActivitiesForSearch($category: String) {
    activities(category: $category) {
      _id
      name
      type
    }
  }
`;
