import gql from "graphql-tag";

export const DEALSCOUNTINANSTAGE = gql`
  query nonDeletedDealsCountInAnStageByPipeline($pipelineId: ID, $stageId: ID) {
    nonDeletedDealsCountInAnStageByPipeline(
      pipelineId: $pipelineId
      stageId: $stageId
    )
  }
`;
