import gql from "graphql-tag";

export const FLATTENNING = gql`
  mutation runFlattening($models: JSON, $chunkSize: Int) {
    runFlattening(models: $models, chunkSize: $chunkSize)
  }
`;
