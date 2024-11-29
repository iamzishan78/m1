import gql from "graphql-tag";


export const REMOVEPAYMENTPROPERTY = gql`
  mutation removePaymentPropertyDescriptor($paymentId:String, $propertyId: String) {
    removePaymentPropertyDescriptor(paymentId: $paymentId, propertyId: $propertyId)
  }
`;
