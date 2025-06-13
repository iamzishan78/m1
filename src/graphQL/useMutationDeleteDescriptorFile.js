import gql from 'graphql-tag';

export const DELETEDESCRIPTORFILE = gql`
	mutation deleteDescriptorFile($id: String, $currentAsset: JSON) {
		deleteFileDescriptor(descriptorId: $id, currentAsset: $currentAsset) {
			success
			message
		}
	}
`;

export const DELETEDESCRIPTORRELATEDFILE = gql`
	mutation deleteDescriptorRelatedFile($descriptorObjectId: String, $relatedObjectId: String) {
		deleteRelatedFileDescriptor(descriptorObjectId: $descriptorObjectId, relatedObjectId: $relatedObjectId) {
			success
			message
		}
	}
`;
