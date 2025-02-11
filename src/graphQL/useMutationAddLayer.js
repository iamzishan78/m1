import gql from 'graphql-tag';

export const ADDLAYER = gql`
	mutation addLayer($layer: LayerInput) {
		addLayer(layer: $layer)
	}
`;
