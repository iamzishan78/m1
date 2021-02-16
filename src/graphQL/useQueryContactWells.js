import gql from "graphql-tag";

export const CONTACTWELLS = gql`
  query getContactWells(
    $contactId: String
  ) {
    contactWells(
      contactId: $contactId
    )
  }
`;
