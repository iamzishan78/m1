import gql from 'graphql-tag';

export const CONTACT_SUMMARY = gql`
	query getContactSummary($contactId: ID) {
		contactSummary(contactId: $contactId)
	}
`;
