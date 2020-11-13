import gql from "graphql-tag";

export const VIEWFILEQUERY = gql`
  query viewFile($fileId: ID) {
    viewFile(fileId: $fileId) {
      id
      name
      uri
      internalKey
    }
  }
`;
