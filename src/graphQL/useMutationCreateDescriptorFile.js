import gql from "graphql-tag";

export const CREATEDESCRIPTORFILE = gql`
  mutation AddDescriptorFile($fileName: String, $descriptorObjectId:ID, $userId: ID, $relatedObjectId: ID, $relatedObjectType: String) {
    createFileDescriptor(
      fileName: $fileName
      descriptorObjectId: $descriptorObjectId
      userId: $userId
      relatedObjectId: $relatedObjectId
      relatedObjectType: $relatedObjectType
    ) {
      success
      message
      error
      file {
        id
        name
        uri
        internalKey
      }
    }
  }
`;
