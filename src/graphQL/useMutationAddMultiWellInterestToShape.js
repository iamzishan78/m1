import gql from 'graphql-tag';

export const ADD_MULTI_WELLINTEREST_TO_SHAPE = gql`
	mutation AddMultiWellInterestToShape($wells: JSON, $shapeId: ID, $shapeType: String, $userId: ID) {
		addMultiWellInterestToShape(wells: $wells, shapeId: $shapeId, shapeType: $shapeType, userId: $userId)
	}
`;
