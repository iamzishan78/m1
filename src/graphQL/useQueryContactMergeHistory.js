import gql from "graphql-tag";

export const GET_CONTACT_MERGE_HISTORY = gql`
  query getContactMergeHistory($contactId: ID, $fields: JSON) {
    getContactMergeHistory(contactId: $contactId, fields: $fields)
  }
`;
