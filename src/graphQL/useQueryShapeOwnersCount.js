import gql from 'graphql-tag';

export const SHAPEOWNERSCOUNT = gql`
	query getShapeOwnersCount($polygon: JSON, $search: String, $filters: [JSON]) {
		shapeOwnersCount(polygon: $polygon, search: $search, filters: $filters)
	}
`;

export const SHAPEOWNERSINTERESTCOUNT = gql`
	query getShapeOwnersInterestCount($polygon: JSON, $pagination: JSON, $search: String, $filters: [JSON]) {
		shapeOwnersInterestCount(polygon: $polygon, pagination: $pagination, search: $search, filters: $filters)
	}
`;
