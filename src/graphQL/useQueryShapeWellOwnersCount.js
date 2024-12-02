import gql from 'graphql-tag';

export const SHAPE_WELL_OWNERS_COUNT = gql`
	query getShapeWellOwnersCount($polygon: String, $selectedYear: String = "", $filterByWells: String = "") {
		shapeWellOwnersCount(polygon: $polygon, selectedYear: $selectedYear, filterByWells: $filterByWells)
	}
`;
