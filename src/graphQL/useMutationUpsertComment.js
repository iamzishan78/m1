import gql from "graphql-tag";

export const UPSERTCOMMENT = gql`
  mutation UpsertComment($comment: CommentInput) {
    upsertComment(comment: $comment) {
      success
      message
      comment {
        _id
        comment
        ts
        public
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
