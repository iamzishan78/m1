import gql from 'graphql-tag';

export const ADD_SHAPE_WELL_INTEREST = gql`
	mutation AddShapeWellInterest($wellInterest: JSON) {
		addShapeWellInterest(wellInterest: $wellInterest)
	}
`;
