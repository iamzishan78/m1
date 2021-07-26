import gql from "graphql-tag";

export const UPDATE_PARCEL_AGREEMENT = gql`
  mutation updateParcelAgreement($agreement: AgreementInput) {
    updateParcelAgreement(agreement: $agreement) {
      success
      message
      error
    }
  }
`;
