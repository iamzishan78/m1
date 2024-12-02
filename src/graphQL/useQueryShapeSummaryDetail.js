import gql from 'graphql-tag';

export const SHAPE_SUMMARY_DETAILS = gql`
	query getShapeSummaryDetails($shapeId: ID, $shapeType: String) {
		shapeSummaryDetails(shapeId: $shapeId, shapeType: $shapeType)
	}
`;
