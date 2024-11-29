import gql from "graphql-tag";

export const GET_PAYMENT_AUTOCOMPLETE_LIST = gql`
  query paymentAutoCompleteList($key: String) {
    paymentAutoCompleteList(
      key: $key,
    ) 
  }
`;
