import gql from "graphql-tag";

export const REMOVETAG = gql`
  mutation removeTag($tagId: ID) {
    removeTag(tagId: $tagId) {
      success
      message
      error
    }
  }
`;
