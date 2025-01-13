import gql from 'graphql-tag';

export const UPDATE_PAYMENT = gql`
	mutation updatePayment($payment: JSON) {
		updatePayment(payment: $payment)
	}
`;
