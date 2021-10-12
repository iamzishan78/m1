import gql from "graphql-tag";

export const GET_ES_CONTACTS_FILTER = gql`
  query getESContactsFilter( $filterKey: String, $search: String, $size: Int) {
    getESContactsFilter(
      filterKey: $filterKey,
      search: $search,
      size: $size
    )
  }
`;
