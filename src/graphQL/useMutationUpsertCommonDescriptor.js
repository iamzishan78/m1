import gql from 'graphql-tag';

export const UPSERTCOMMONDESCRIPTOR = gql`
	mutation upsertCommonDescriptor(
		$descriptorId: ID
		$relatedObject: ID
		$relatedObjectType: String
		$descriptorType: String
		$userId: ID
	) {
		upsertCommonDescriptor(
			descriptorId: $descriptorId
			relatedObject: $relatedObject
			relatedObjectType: $relatedObjectType
			descriptorType: $descriptorType
			userId: $userId
		) {
			success
			message
			error
			descriptor
		}
	}
`;
