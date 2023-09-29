import gql from "graphql-tag";

export const GET_PARCEL_OWNERS_DATA = gql`
  query getParcelOwnersData ($ids: JSON) {
    getParcelOwnersData(ids: $ids)
  }
`;
