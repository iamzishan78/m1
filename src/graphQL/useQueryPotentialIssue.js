import gql from "graphql-tag";

export const GET_ES_POTENTIAL_ISSUES = gql`
  query getPotentialIssuesSummary( $esIndex: String, $size: Int) {
    getPotentialIssuesSummary(
      esIndex: $esIndex, 
      size: $size
    )
  }
`;
