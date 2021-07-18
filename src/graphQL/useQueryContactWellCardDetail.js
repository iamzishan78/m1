import gql from "graphql-tag";

export const CONTACT_WELL_CARD_DETAIL = gql`
  query getContactWellCardDetail(
    $contactId: ID
  ) {
    contactWellCardDetail(
      contactId: $contactId
    )
  }
`;
