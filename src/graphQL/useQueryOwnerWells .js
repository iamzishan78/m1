import gql from "graphql-tag";

export const OWNERWELLSQUERY = gql`
  query getOwnerWells($ownerId: String) {
    ownerWells(ownerId: $ownerId)
  }
`;
