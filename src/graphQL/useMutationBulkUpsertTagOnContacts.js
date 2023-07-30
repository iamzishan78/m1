import gql from "graphql-tag";

export const BULKUPSERTTAG = gql`
  mutation bulkUpsertTagOnContacts($tags: [String], $user: String, $contactIds: [String], $objectType: String) {
    bulkUpsertTagOnContacts(tags: $tags, user: $user, contactIds: $contactIds,objectType:$objectType) {
      success
      message
    }
  }
`;
