import gql from 'graphql-tag';

export const GETLAYERBYFILEID = gql`
	query layerByFileId($fileIds: [ID!]!, $userId: ID) {
		layerByFileId(fileIds: $fileIds, userId: $userId)
	}
`;
