import gql from "graphql-tag";

export const UPDATEBULKPARCEL = gql`
  mutation UpdateBulkParcel($contactIds: [ID], $keysToUpdate:JSON) {
    updateBulkParcel(contactIds: $contactIds, keysToUpdate: $keysToUpdate) {
      success
      message
      error
    }
  }
`;
