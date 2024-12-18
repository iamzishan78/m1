import gql from 'graphql-tag';

export const CONTACT_ENTITY = gql`
	query getContactEntity($contactId: ID) {
		contactEntity(contactId: $contactId)
	}
`;
