import gql from "graphql-tag";

export const WELLINTERESTSFILTEROPTIONS = gql`
  query getWellInterestsFilterOptions(
    $search: String
  ) {
    wellInterestsFilterOptions(
      search: $search
    )
  }
`;
