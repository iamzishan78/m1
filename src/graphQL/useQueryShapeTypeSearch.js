import gql from 'graphql-tag';

export const SHAPE_LAYER_SEARCH = gql`
	query getShapeLayerSearch($search: String, $shapeType: String) {
		shapeLayerSearch(search: $search, shapeType: $shapeType)
	}
`;
