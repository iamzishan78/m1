import gql from "graphql-tag";

export const GETCONTACTSFROMDOCUMENTS = gql`
  query getContactsFromDocument($descriptorObject: ID) {
    getContactDescriptors(descriptorObject: $descriptorObject) {
      _id
      Contacts
    }
  }
`;
