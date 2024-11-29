import gql from "graphql-tag";


export const REMOVECONTACTPAYMENT = gql`
  mutation removePaymentContactDescriptor($paymentId:String, $contactId: String) {
    removePaymentContactDescriptor(paymentId: $paymentId, contactId: $contactId)
  }
`;
