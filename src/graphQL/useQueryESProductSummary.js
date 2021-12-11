import gql from "graphql-tag";

export const GET_ES_PRODUCT_SUMMARY = gql`
  query getESProductSummary( $esIndex: String, $size: Int) {
    getProductSummary(
      esIndex: $esIndex, 
      size: $size
    ),
  }
`;
