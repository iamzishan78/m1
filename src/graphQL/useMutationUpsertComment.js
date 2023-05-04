import gql from "graphql-tag";

export const UPSERTCOMMENT = gql`
  mutation UpsertComment($comment: CommentInput) {
    upsertComment(comment: $comment) {
      success
      message
      comment {
        _id
        commentType
        comment
        ts
        public
        pin
        commentedOn
        objectType
        user {
          name
          email
        }
      }
    }
  }
`;
