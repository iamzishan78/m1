import gql from "graphql-tag";

export const CONTACTSFILTEROPTIONS = gql`
  query getContactsFilterOptions(
    $search: String
  ) {
    contactsFilterOptions(
      search: $search
    )
  }
`;
