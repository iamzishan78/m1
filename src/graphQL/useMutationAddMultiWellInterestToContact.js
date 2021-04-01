import gql from "graphql-tag";

export const ADD_MULTI_WELLINTEREST_TO_CONTACT = gql`
  mutation AddMultiWellInterestToContact($wells: JSON, $contactId: ID, $userId: ID ) {
    addMultiWellInterestToContact(wells: $wells, contactId: $contactId,userId: $userId)
  }
`;
