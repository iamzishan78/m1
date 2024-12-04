import gql from 'graphql-tag';

export const REMOVEBILLINGPAYMENT = gql`
	mutation removeBillingPartyContactDescriptorscriptor($paymentId: String, $contactId: String) {
		removeBillingPartyContactDescriptor(paymentId: $paymentId, contactId: $contactId)
	}
`;
