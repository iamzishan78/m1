import gql from "graphql-tag";

export const ADD_DATASET = gql`
  mutation addDataset($dataset: JSON) {
    addDataset(dataset: $dataset)
  }
`;
