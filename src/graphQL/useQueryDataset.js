import gql from 'graphql-tag';

export const GET_DATASETS = gql`
	query getDatasets($userId: ID) {
		getDatasets(userId: $userId)
	}
`;

export const GET_DATASET = gql`
	query getDataset($fileId: ID) {
		getDataset(fileId: $fileId) {
			success
			message
			error
			data
		}
	}
`;

export const GET_DATASET_UPLOAD_STATE = gql`
	query getDatasetUploadState($fileId: ID) {
		getDatasetUploadState(fileId: $fileId) {
			success
			message
			error
			data
		}
	}
`;
