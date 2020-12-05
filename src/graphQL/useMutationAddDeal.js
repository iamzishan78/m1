import gql from "graphql-tag";

export const ADDDEAL = gql`
  mutation addDeal(
    $deal: JSON
    $stageId: ID
    $pipelineId: ID
    $ownerId: ID
    $contactId: ID
    $position: String
    $userId: ID
  ) {
    addDeal(
      deal: $deal
      stageId: $stageId
      pipelineId: $pipelineId
      ownerId: $ownerId
      contactId: $contactId
      position: $position
      userId: $userId
    ) {
      success
      message
      error
    }
  }
`;
