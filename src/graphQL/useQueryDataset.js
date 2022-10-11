import gql from "graphql-tag";

export const GET_DATASETS = gql`
  query getDatasets($userId:ID){
    getDatasets(userId:$userId)
  }
`;