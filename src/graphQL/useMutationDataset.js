import gql from 'graphql-tag';

export const ADD_DATASET = gql`
	mutation addDataset($dataset: JSON) {
		addDataset(dataset: $dataset)
	}
`;

export const UPDATE_DATASET = gql`
	mutation updateDataset($dataset: JSON) {
		updateDataset(dataset: $dataset)
	}
`;

export const CREATE_DATASET_LAYERS = gql`
	mutation createDatasetLayers(
		$dataset: JSON
		$groupName: String
		$layerNames: [String]
		$isCreateLayers: Boolean
		$defaultSettings: [JSON]
		$shouldUpdateDataset: Boolean
	) {
		createDatasetLayers(
			dataset: $dataset
			groupName: $groupName
			layerNames: $layerNames
			isCreateLayers: $isCreateLayers
			defaultSettings: $defaultSettings
			shouldUpdateDataset: $shouldUpdateDataset
		) {
			success
			message
			error
			data
		}
	}
`;
