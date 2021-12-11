import gql from "graphql-tag";

export const GET_ES_REVENUE_SUMMARY = gql`
  query getESRevenueSummary( $esIndex: String, $size: Int) {
    getRevenueSummary(
      esIndex: $esIndex, 
      size: $size
    ),
  }
`;
