import gql from "graphql-tag";

export const CREATE_AGREEMENT_PROVISION = gql`
  mutation createAgreementProvision($provision: JSON) {
    createAgreementProvision(provision: $provision)
  }
`;
