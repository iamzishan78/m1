import gql from "graphql-tag";

export const GET_SHAPE_OWNERS_DATA_BY_ID = gql`
  query getShapeOwnerDataById ($ids: JSON) {
    getShapeOwnerDataById(ids: $ids)
  }
`;
