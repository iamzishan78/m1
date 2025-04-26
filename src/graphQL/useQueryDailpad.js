import gql from 'graphql-tag';

export const GET_DIALPAD_CONTACT = gql`
	query getDailpadContact($contactId: String) {
		getDailpadContact(contactId: $contactId)
	}
`;
