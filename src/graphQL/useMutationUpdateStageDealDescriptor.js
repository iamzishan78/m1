import gql from "graphql-tag";

export const UPDATESTAGEDEALDESCRIPTOR = gql`
  mutation updateStageDealDescriptor(
    $descriptorId: ID
    $relatedObject: ID
    $position: String
  ) {
    updateStageDealDescriptor(
      descriptorId: $descriptorId
      relatedObject: $relatedObject
      position: $position
    ) {
      success
      message
      error
      stageDealDescriptors
    }
  }
`;
