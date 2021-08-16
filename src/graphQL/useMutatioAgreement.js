import gql from "graphql-tag";

export const ADD_AGREEMENT = gql`
  mutation addAgreement($agreement: JSON) {
    addAgreement(agreement: $agreement) {
      success
      message
      error
      agreement
    }
  }
`;

export const UPDATE_AGREEMENT = gql`
  mutation updateAgreement($agreement: JSON) {
    updateAgreement(agreement: $agreement) {
      success
      message
      error
      agreement
    }
  }
`;
