import gql from "graphql-tag";

export const CONTACSCOUNTER = gql`
  query getContactsCounter($objectsIdsArray: [String]) {
    contactsCounter(objectsIdsArray: $objectsIdsArray)
  }
`;
