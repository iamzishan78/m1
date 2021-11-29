import gql from "graphql-tag";

export const GET_PROVISION_AUTOCOMPLETE_LIST = gql`
  query provisionAutoCompleteList($key: String, $agreementId: ID) {
    provisionAutoCompleteList(
      key: $key,
      agreementId: $agreementId
    )
  }
`;
