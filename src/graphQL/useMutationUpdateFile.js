import gql from "graphql-tag";

export const UPDATEFILE = gql`
  mutation updateFileDescriptor($fileName: String, $dateTime: String, $documentNumber: String, $documentType: String, $partyName1: String, $partyName2: String, $relatedObjectId:  String, $descriptorId: String, $fileId: String) {
    
    updateFileDescriptor(
      descriptorId: $descriptorId
    fileName: $fileName
      dateTime: $dateTime
    documentNumber: $documentNumber
    documentType: $documentType
    partyName1: $partyName1   
    partyName2: $partyName2
    relatedObjectId: $relatedObjectId
   fileId: $fileId
    ) {
      success
      message
      error
    }
  }
`;
