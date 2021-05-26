import gql from "graphql-tag";

export const DEALSCOUNTINAPIPE = gql`
  query nonDeletedDealsCountInAPipeline($pipelinesIds: [ID]) {
    nonDeletedDealsCountInAPipeline(pipelinesIds: $pipelinesIds)
  }
`;
