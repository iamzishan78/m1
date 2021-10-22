import gql from "graphql-tag";

export const GET_GRID_VIEWS = gql`
  query getGridViews( $userId: ID) {
    getGridViews(userId: $userId)
  }
`;
