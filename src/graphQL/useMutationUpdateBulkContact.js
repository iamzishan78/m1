import gql from "graphql-tag";

export const UPDATEBULKCONTACT = gql`
  mutation UpdateBulkContact($contactIds: [ID], $keysToUpdate:JSON, $ignoreResponse: Boolean) {
    updateBulkContact(contactIds: $contactIds, keysToUpdate: $keysToUpdate, ignoreResponse: $ignoreResponse) {
      success
      message
      error
    }
  }
`;
