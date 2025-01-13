import gql from 'graphql-tag';

export const UPDATE_MANY_LAYER = gql`
	mutation updateManyLayer($layers: [LayerInput], $layerGroupId: ID) {
		updateManyLayer(layers: $layers, layerGroupId: $layerGroupId)
	}
`;
