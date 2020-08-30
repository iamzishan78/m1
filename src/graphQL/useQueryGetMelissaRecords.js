import gql from "graphql-tag";

export const MELISSARECORDS = gql`
  query getMelissaRecords($contactId: ID) {
    getMelissaRecords(contactId: $contactId)
  }
`;

export const MELISSARECORDSCOUNTBYIDS = gql`
  query getMelissaRecordsCountForContactIds($objectsIdsArray: [String]) {
    getMelissaRecordsCountForContactIds(objectsIdsArray: $objectsIdsArray)
  }
`;
