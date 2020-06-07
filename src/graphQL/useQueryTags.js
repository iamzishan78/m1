import gql from "graphql-tag";

export const TAGSQUERY = gql`
  query getTags($tagIdArray: [ID], $public: Boolean) {
    tags(tagIdArray: $tagIdArray, public: $public) {
      id
      tag
      public
    }
  }
`;
