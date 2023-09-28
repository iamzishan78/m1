import gql from "graphql-tag";

export const GET_VIEW_TOKEN_URI = gql`
  query getViewTokenUri ($file: JSON) {
    getViewTokenUri(file: $file)
  }
`;
