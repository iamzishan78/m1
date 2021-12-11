import gql from "graphql-tag";

export const GET_ES_ADJUSTMENT_SUMMARY = gql`
  query getESAdjustmentSummary( $esIndex: String, $size: Int) {
    getAddjustmentSummary(
      esIndex: $esIndex, 
      size: $size
    ),
  }
`;
