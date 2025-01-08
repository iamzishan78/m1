import gql from 'graphql-tag';

export const ADD_PAYMENT_CONTACT_DESCRIPTOR = gql`
	mutation addPaymentContactDescriptor($payment: JSON) {
		addPaymentContactDescriptor(payment: $payment)
	}
`;

export const ADD_BILLING_PARTY_CONTACT_DESCRIPTOR = gql`
	mutation addBillingPartyContactDescriptor($billingParty: JSON) {
		addBillingPartyContactDescriptor(billingParty: $billingParty)
	}
`;

export const ADD_PAYMENT_PROPERTY_DESCRIPTOR = gql`
	mutation addPaymentPropertyDescriptor($property: JSON, $propertyId: String) {
		addPaymentPropertyDescriptor(property: $property, propertyId: $propertyId)
	}
`;
