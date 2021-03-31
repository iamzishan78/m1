import gql from "graphql-tag";

export const ADD_MULTI_WELLINTEREST_TO_CONTACT = gql`
  mutation AddMultiWellInterestToContact($wellIds: [String], $contactId: ID, $userId: ID ) {
    addMultiWellInterestToContact(wellIds: $wellIds, contactId: $contactId,userId: $userId)
  }
`;
