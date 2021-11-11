import gql from "graphql-tag";

export const GET_ES_SHAPE_TRACTS = gql`
  query getESShapeTracts( $search: String, $sort: JSON, $pagination: JSON, $filters: [JSON]) {
    getESShapeTracts(
      search: $search,
      sort: $sort,
      pagination: $pagination,
      filters: $filters
    )
  }
`;
