import gql from 'graphql-tag';

export const REMOVEPAYMENT = gql`
	mutation removePayment($paymentId: ID) {
		removePayment(paymentId: $paymentId)
	}
`;
