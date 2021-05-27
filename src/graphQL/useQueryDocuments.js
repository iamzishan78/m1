import gql from "graphql-tag";

export const GET_DOCUMENTS = gql`
  query getDocuments(
    $search: String
  ) {
    getFiles(
      search: $search
    )
  }
`;
