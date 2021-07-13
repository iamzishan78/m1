import gql from "graphql-tag";

export const ADD_PARCEL_AGREEMENT = gql`
  mutation addParcelAgreement($agreement: AgreementInput) {
    addParcelAgreement(agreement: $agreement) {
      success
      message
      error
    }
  }
`;
