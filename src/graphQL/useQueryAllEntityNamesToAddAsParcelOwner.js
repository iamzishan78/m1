import gql from "graphql-tag";

export const ALLENTITYNAMESFORPARCEL = gql`
  query getAllEntityNamesToAddAsParcelOwner($parcelId: ID) {
    allEntityNamesToAddAsParcelOwner(parcelId: $parcelId)
  }
`;
