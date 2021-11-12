import gql from "graphql-tag";

export const GET_ES_SHAPE_WELLS = gql`
  query getESShapeWells( $search: String, $sort: JSON, $pagination: JSON, $filters: [JSON]) {
    getESShapeWells(
      search: $search,
      sort: $sort,
      pagination: $pagination,
      filters: $filters
    )
  }
`;
