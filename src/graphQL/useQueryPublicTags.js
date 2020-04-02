import gql from "graphql-tag";

export const PUBLICTAGSQUERY = gql`
  query getPublicTags {
    publicTags
  }
`;
