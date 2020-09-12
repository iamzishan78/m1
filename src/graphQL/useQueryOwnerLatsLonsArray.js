import gql from "graphql-tag";

export const OWNERSLATSLONS = gql`
  query getOwnerLatsLonsArray($ownerId: ID) {
    ownerLatsLonsArray(ownerId: $ownerId)
  }
`;
