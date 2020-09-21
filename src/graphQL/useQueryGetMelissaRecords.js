import gql from "graphql-tag";

export const LASTMELISSARECORD = gql`
  query getLastMelissaRecord($contactId: ID) {
    getLastMelissaRecord(contactId: $contactId)
  }
`;

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
