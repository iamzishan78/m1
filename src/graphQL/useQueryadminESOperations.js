import gql from "graphql-tag";

export const GET_ES_OPERATIONS_MODELS = gql`
  query getESOperationsModels($type: String) {
    getESOperationsModels(type: $type)
  }
`;