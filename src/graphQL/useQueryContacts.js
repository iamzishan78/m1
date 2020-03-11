import React from "react";
import gql from "graphql-tag";

export const CONTACTSQUERY = gql`
  query getContacts($contactsIdArray: [String]) {
    contacts(contactsIdArray: $contactsIdArray) {
      success
      message
      results {
        id
        name
        email
        phone
        addres
      }
    }
  }
`;
