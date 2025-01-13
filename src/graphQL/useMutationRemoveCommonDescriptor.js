import gql from 'graphql-tag';

export const REMOVECOMMONDESCRIPTOR = gql`
	mutation removeCommonDescriptor($id: ID, $relatedObjectType: String) {
		removeCommonDescriptor(descriptorId: $id, relatedObjectType: $relatedObjectType) {
			success
			message
			error
		}
	}
`;
