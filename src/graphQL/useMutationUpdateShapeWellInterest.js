import gql from 'graphql-tag';

export const UPDATE_SHAPE_WELL_INTEREST = gql`
	mutation UpdateShapeWellInterest($wellInterests: [JSON]) {
		updateShapeWellInterests(wellInterests: $wellInterests)
	}
`;
