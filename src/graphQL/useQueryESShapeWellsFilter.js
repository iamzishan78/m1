import gql from "graphql-tag";

export const GET_ES_SHAPE_WELLS_FILTER = gql`
  query getESShapeWellFilter( $filterKey: String, $search: String, $size: Int) {
    getESShapeWellFilter(
      filterKey: $filterKey,
      search: $search,
      size: $size
    )
  }
`;
