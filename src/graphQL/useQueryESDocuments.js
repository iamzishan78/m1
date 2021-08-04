import gql from "graphql-tag";

export const GET_ES_DOCUMENTS = gql`
  query getESDocuments( $search: String, $sort: JSON, $pagination: JSON) {
    getESFiles(
      search: $search,
      sort: $sort,
      pagination: $pagination
    )
  }
`;
