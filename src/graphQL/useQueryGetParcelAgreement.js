import gql from "graphql-tag";

export const GET_PARCELS_AGREEMENT = gql`
  query getParcelAgreement($parcelId: ID) {
    getParcelAgreement(parcelId: $parcelId)
  }
`;
