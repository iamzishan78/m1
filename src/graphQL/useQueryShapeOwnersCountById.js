import gql from "graphql-tag";

export const GET_SHAPE_OWNERS_COUNT_BY_ID = gql`
  query getShapeOwnerCountByID ($ids: JSON) {
    getShapeOwnerCountByID(ids: $ids)
  }
`;
