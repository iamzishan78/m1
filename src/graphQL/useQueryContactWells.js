import gql from "graphql-tag";

export const CONTACTWELLS = gql`
  query getContactWells(
    $contactId: ID
  ) {
    contactWells(
      contactId: $contactId
    )
  }
`;
