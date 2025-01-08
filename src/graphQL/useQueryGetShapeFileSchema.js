import gql from 'graphql-tag';

export const GET_SHAPE_FILE_SCHEMA = gql`
	query getShapeFileSchema($layerId: String, $file: String, $layerShapeName: String) {
		getShapeFileSchema(layerId: $layerId, file: $file, layerShapeName: $layerShapeName)
	}
`;
