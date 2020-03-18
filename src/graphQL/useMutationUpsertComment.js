import gql from "graphql-tag";

export const UPSERTCOMMENT = gql`
  mutation UpsertComment($comment: CommentInput) {
    upsertComment(comment: $comment) {
      success
      message
      comment {
        id
        comment
      }
    }
  }
`;
