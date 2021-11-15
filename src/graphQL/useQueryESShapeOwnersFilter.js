import gql from "graphql-tag";

export const GET_ES_SHAPE_OWNERS_FILTER = gql`
  query getESShapeOwnersFilter( $filterKey: String, $search: String, $size: Int) {
    getESShapeOwnersFilter(
      filterKey: $filterKey,
      search: $search,
      size: $size
    )
  }
`;
