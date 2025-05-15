import gql from 'graphql-tag';

export const ADD_ASSOCIATED_MODEL_DATA = gql`
	mutation addAssociatedModelData(
		$mainAssetTableName: String!
		$associatedAssetTableName: String!
		$relatedObject: String!
		$descriptorObject: String!
		$descriptorType: String!
		$relatedObjectType: String!
		$associationModelName: String!
	) {
		addAssociatedModelData(
			mainAssetTableName: $mainAssetTableName
			associatedAssetTableName: $associatedAssetTableName
			relatedObject: $relatedObject
			descriptorObject: $descriptorObject
			descriptorType: $descriptorType
			relatedObjectType: $relatedObjectType
			associationModelName: $associationModelName
		)
	}
`;
