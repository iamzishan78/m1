import gql from "graphql-tag";

export const FLATTEN = gql`
  mutation flatten($models: JSON, $chunkSize: Int) {
    flatten(models: $models, chunkSize: $chunkSize)
  }
`;

export const REINDEX = gql`
  mutation reindex($models: JSON) {
    reindex(models: $models)
  }
`;

