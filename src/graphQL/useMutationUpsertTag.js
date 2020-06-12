import gql from "graphql-tag";

export const UPSERTTAG = gql`
  mutation UpsertTag($tag: TagInput) {
    upsertTag(tag: $tag) {
      success
      message
      tag {
        _id
        tag
        ts
        public
        taggedOn
        objectType
      }
    }
  }
`;
