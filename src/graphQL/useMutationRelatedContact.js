import gql from 'graphql-tag';

export const ADD_RELATED_CONTACT = gql`
	mutation addRelatedContact($descriptorObject: ID!, $relationshipType: String!, $relatedObject: ID!, $userId: ID!) {
		addRelatedContact(
			descriptorObject: $descriptorObject
			relationshipType: $relationshipType
			relatedObject: $relatedObject
			userId: $userId
		)
	}
`;

// This GraphQL mutation adds related contacts to a descriptor object.s
export const ADD_RELATED_CONTACTS = gql`
	mutation addRelatedContacts($descriptorObject: ID!, $relationshipType: String!, $relatedObject: [ID]!, $userId: ID!) {
		addRelatedContacts(
			descriptorObject: $descriptorObject
			relationshipType: $relationshipType
			relatedObject: $relatedObject
			userId: $userId
		)
	}
`;

export const DELETE_RELATED_CONTACT = gql`
	mutation deleteRelatedContacts($descriptorObjects: [ID]!, $relatedObject: ID!) {
		deleteRelatedContacts(descriptorObjects: $descriptorObjects, relatedObject: $relatedObject)
	}
`;
