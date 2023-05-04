import gql from "graphql-tag";

export const ADDDEAL = gql`
  mutation addDeal(
    $deal: JSON
    $stageId: ID
    $pipelineId: ID
    $ownerId: ID
    $ownerName: String
    $contactId: ID
    $contactName: String
    $position: Int
    $userId: ID
    $files: JSON
    $comments: JSON
  ) {
    addDeal(
      deal: $deal
      stageId: $stageId
      pipelineId: $pipelineId
      ownerId: $ownerId
      ownerName: $ownerName
      contactId: $contactId
      contactName: $contactName
      position: $position
      userId: $userId
      files: $files
      comments: $comments
    ) {
      success
      message
      deal
      error
    }
  }
`;

export const DEAL_DESCRIPTOR = gql`
  mutation dealDescriptor($deal: JSON) {
    dealDescriptor(deal: $deal) {
      success
      message
      error
    }
  }
`;

export const CREATE_DEAL_DEFAULT_SETTINGS = gql`
  mutation createDealDefaultSettings($stageDealDescriptors: [JSON], $dealId: ID) {
    createDealDefaultSettings(stageDealDescriptors: $stageDealDescriptors, dealId: $dealId)
  }
`;
