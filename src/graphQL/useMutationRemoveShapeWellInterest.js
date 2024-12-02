import gql from 'graphql-tag';

export const REMOVE_SHAPE_WELL_INTEREST = gql`
	mutation RemoveShapeWellInterest($id: ID) {
		removeShapeWellInterest(id: $id)
	}
`;
