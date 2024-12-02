import gql from 'graphql-tag';

export const UPSERT_USER_DESCRIPTOR = gql`
	mutation upsertUserDescriptor($descriptorObject: ID, $userId: ID, $relatedObject: ID, $relatedObjectType: String) {
		upsertUserDescriptor(
			descriptorObject: $descriptorObject
			userId: $userId
			relatedObject: $relatedObject
			relatedObjectType: $relatedObjectType
		)
	}
`;
