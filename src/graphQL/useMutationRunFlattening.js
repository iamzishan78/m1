import gql from "graphql-tag";

export const FLATTENNING = gql`
  mutation runFlattening($models: JSON) {
    runFlattening(models: $models)
  }
`;
