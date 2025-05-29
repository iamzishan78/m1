import gql from 'graphql-tag';

export const SYNC_CONTACT_TO_DIALPAD = gql`
	mutation syncContactToDialpad($contactId: String) {
		syncContactToDialpad(contactId: $contactId) {
			success
			message
		}
	}
`;
