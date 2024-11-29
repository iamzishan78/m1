import gql from "graphql-tag";

export const AGREEMENT_PAYMENT_SUMMARY = gql`
  query getAgreementPaymentSummary($paymentId: String) {
    agreementPaymentSummary(paymentId: $paymentId)
  }
`;
