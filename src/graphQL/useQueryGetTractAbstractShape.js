import gql from 'graphql-tag';

export const GET_TRACT_ABSTRACT_SHAPE = gql`
	query getTractAbstractShape($tract: JSON) {
		getTractAbstractShape(tract: $tract)
	}
`;
