import gql from "graphql-tag";

export const MERGE_CONTACTS = gql`
  mutation mergeContacts($primary: ID, $secondary: [ID], $mergedBy:ID) {
    mergeContacts(primary: $primary, secondary: $secondary, mergedBy: $mergedBy)
  }
`;
