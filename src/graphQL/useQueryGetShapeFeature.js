import gql from 'graphql-tag';

export const GET_SHAPE_FEATURE = gql`
	query getShapeFeature($id: ID) {
		getShapeFeature(id: $id) {
			success
			message
			error
			data
		}
	}
`;
