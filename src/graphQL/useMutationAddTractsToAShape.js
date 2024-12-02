import gql from 'graphql-tag';

export const ADD_TRACTS_TOA_SHAPE = gql`
	mutation addTractToAShape($shapeTracts: [JSON], $shapeType: String) {
		addTractsToAShape(shapeTracts: $shapeTracts, shapeType: $shapeType)
	}
`;
