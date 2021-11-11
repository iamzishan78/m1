import gql from "graphql-tag";

export const GET_ES_SHAPE_OWNERS = gql`
  query getESShapeOwners( $search: String, $sort: JSON, $pagination: JSON, $filters: [JSON]) {
    getESShapeOwners(
      search: $search,
      sort: $sort,
      pagination: $pagination,
      filters: $filters
    )
  }
`;
