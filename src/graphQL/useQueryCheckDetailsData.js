import gql from "graphql-tag";

export const GET_CHECK_DETAILS_DATA = gql`
  query getCheckDetailsData($index: String) {
    getCheckDetailsData(
      index: $index,
    )
  }
`;
