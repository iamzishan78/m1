import gql from 'graphql-tag';

export const RESYNC_DIALPAD_CONTACT = gql`
	mutation resyncDialpadContact($contactId: String) {
		resyncDialpadContact(contactId: $contactId) {
			success
			message
		}
	}
`;
