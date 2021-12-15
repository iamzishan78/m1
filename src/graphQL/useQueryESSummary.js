import gql from "graphql-tag";

export const GET_ES_SUMMARY = gql`
  query getESSummary( $esIndex: String, $extendSearchQuery: String, $size: Int) {
    getESSummary(
      esIndex: $esIndex, 
      size: $size,
      extendSearchQuery: $extendSearchQuery,
    )
  }
`;
