import gql from "graphql-tag";

export const CONTACT_ASSOCIATED_WELL_COUNT = gql`
  query getContactAssociatedWellCount(
    $contactId: ID
  ) {
    contactAssociatedWellCount(
      contactId: $contactId
    )
  }
`;
