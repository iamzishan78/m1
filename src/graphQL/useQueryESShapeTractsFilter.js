import gql from "graphql-tag";

export const GET_ES_SHAPE_TRACTS_FILTER = gql`
  query getESShapeTractsFilter( $filterKey: String, $search: String, $size: Int) {
    getESShapeTractsFilter(
      filterKey: $filterKey,
      search: $search,
      size: $size
    )
  }
`;
