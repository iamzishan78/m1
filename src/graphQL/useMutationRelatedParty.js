import gql from "graphql-tag";

export const UPSERT_RELATED_PARTY = gql`
  mutation upsertRelatedParty($relatedParty: JSON, $customLayerId: ID) {
    upsertRelatedParty(relatedParty: $relatedParty, customLayerId: $customLayerId)
  }
`;
