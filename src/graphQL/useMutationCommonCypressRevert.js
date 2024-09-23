import gql from 'graphql-tag';

export const REVERTCYPRESSDELETE = gql`
	mutation revertCypressDelete($data: JSON) {
		revertCypressDelete(data: $data) {
			success
			message
		}
	}
`;

export const DELETE_CYPRESS_CUSTOM_LAYERS = gql`
	mutation deleteCypressCustomLayers($geometry: JSON!, $shapeTypes: [String]!) {
		deleteCypressCustomLayers(geometry: $geometry, shapeTypes: $shapeTypes) {
			success
			message
		}
	}
`;