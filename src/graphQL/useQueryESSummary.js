import gql from "graphql-tag";

export const GET_ES_POTENTIAL_ISSUES_SUMMARY = gql`
  query getESPotentialIssuesSummary( $esIndex: String, $size: Int) {
    getESPotentialIssuesSummary(
      esIndex: $esIndex, 
      size: $size,
    )
  }
`;
