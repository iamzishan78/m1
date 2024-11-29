import gql from "graphql-tag";

export const ADD_PAYMENT = gql`
  mutation addPayment($payment: JSON) {
    addPayment(payment: $payment)
  }
`;
