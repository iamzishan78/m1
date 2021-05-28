import gql from "graphql-tag";

export const UPDATE_DOCUMENT = gql`
  mutation updateDocument(
    $fileName: String
    $dateTime: String
    $documentNumber: String
    $documentType: String
    $partyName1: String
    $partyName2: String
    $fileId: String
  ) {
    updateDocumentFile(
      fileName: $fileName
      dateTime: $dateTime
      documentNumber: $documentNumber
      documentType: $documentType
      partyName1: $partyName1
      partyName2: $partyName2
      fileId: $fileId
    ) {
      success
      message
      error
    }
  }
`;
