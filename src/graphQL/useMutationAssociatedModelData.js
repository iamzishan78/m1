import gql from 'graphql-tag';

export const ADD_ASSOCIATED_MODEL_DATA = gql`
	mutation addAssociatedModelData(
		$assetTableName: String!
		$associatedModelName: String!
		$relatedObject: String!
		$descriptorObject: String!
		$descriptorType: String!
		$relatedObjectType: String!
	) {
		addAssociatedModelData(
			assetTableName: $assetTableName
			associatedModelName: $associatedModelName
			relatedObject: $relatedObject
			descriptorObject: $descriptorObject
			descriptorType: $descriptorType
			relatedObjectType: $relatedObjectType
		)
	}
`;
