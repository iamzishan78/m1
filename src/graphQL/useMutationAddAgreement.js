import gql from "graphql-tag";

export const ADD_AGREEMENT = gql`
  mutation addAgreement($agreement: JSON) {
    addAgreement(agreement: $agreement)
  }
`;
