import gql from "graphql-tag";

export const CONTACTWELLINTERESTSFILTEROPTIONS = gql`
  query getContactWellInterestsFilterOptions(
    $filters: [FilterInput] = []
    $search: String
  ) {
    contactWellInterestsFilterOptions(
      filters: $filters
      search: $search
    )
  }
`;
