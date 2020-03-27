import gql from "graphql-tag";

export const REMOVECOMMENT = gql`
  mutation removeComment($commentId: ID) {
    removeComment(commentId: $commentId) {
      success
      message
    }
  }
`;
