import gql from "graphql-tag";

export const UPSERTDEALDESCRIPTOR = gql`
  mutation upsertDealDescriptor(
    $dealId: ID
    $relatedObject: [ID]
    $relatedObjectType: String
    $userId: ID
  ) {
    upsertDealDescriptor(
      dealId: $dealId
      relatedObject: $relatedObject
      relatedObjectType: $relatedObjectType
      userId: $userId
    ) {
      success
      message
      error
      descriptor
    }
  }
`;
