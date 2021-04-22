import gql from "graphql-tag";

export const CONTACTSFILTEROPTIONS = gql`
  query getContactsFilterOptions(
    $filters: [FilterInput] = []
    $search: String
  ) {
    contactsFilterOptions(
      filters: $filters
      search: $search
    )
  }
`;
