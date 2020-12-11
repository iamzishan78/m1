import gql from "graphql-tag";

export const DEALSCOUNTINAPIPE = gql`
  query nonDeletedDealsCountInAPipeline($pipelineId: ID) {
    nonDeletedDealsCountInAPipeline(pipelineId: $pipelineId)
  }
`;
