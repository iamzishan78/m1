import gql from "graphql-tag";

export const ADDDESCRIPTORFILE = gql`
  mutation AddDescriptorFile($fileName: String, $userId: ID, $relatedObjectId: ID, $relatedObjectType: String) {
    addFileDescriptor(
      fileName: $fileName
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
