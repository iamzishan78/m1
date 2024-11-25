import gql from 'graphql-tag';

export const DELETE_SHAPEFILE_FEEATURE = gql`
	mutation deleteShapeFeature($feature: JSON) {
		deleteShapeFeature(feature: $feature) {
			success
			message
			error
			data
		}
	}
`;
