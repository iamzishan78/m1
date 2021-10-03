import gql from "graphql-tag";

export const GET_ES_DOCUMENTS_FILTER = gql`
  query getESDocumentsFilter( $filterKey: String, $search: String, $size: Int) {
    getESFilesFilter(
      filterKey: $filterKey,
      search: $search,
      size: $size
    )
  }
`;
