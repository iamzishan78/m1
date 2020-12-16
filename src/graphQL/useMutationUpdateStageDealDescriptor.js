import gql from "graphql-tag";

export const UPDATESTAGEDEALDESCRIPTOR = gql`
  mutation updateStageDealDescriptor(
    $descriptorId: ID
    $relatedObject: ID
    $position: Int
    $pipeline: ID
  ) {
    updateStageDealDescriptor(
      descriptorId: $descriptorId
      relatedObject: $relatedObject
      position: $position
      pipeline: $pipeline
    ) {
      success
      message
      error
      stageDealDescriptors
    }
  }
`;
