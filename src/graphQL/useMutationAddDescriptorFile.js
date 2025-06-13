import gql from 'graphql-tag';

export const ADDDESCRIPTORFILE = gql`
	mutation AddDescriptorFile(
		$fileName: String
		$userId: ID
		$relatedObjectId: ID
		$relatedObjectType: String
		$fileId: ID
		$currentAsset: JSON
	) {
		addFileDescriptor(
			fileName: $fileName
			userId: $userId
			relatedObjectId: $relatedObjectId
			relatedObjectType: $relatedObjectType
			fileId: $fileId
			currentAsset: $currentAsset
		) {
			success
			message
			error
			file {
				id
				name
				uri
				internalKey
			}
		}
	}
`;
