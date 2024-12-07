import gql from 'graphql-tag';

export const ADD_OWNER_TOA_SHAPE = gql`
	mutation addOwnerToAShape($shapeOwner: JSON, $shapeType: String) {
		addOwnerToAShape(shapeOwner: $shapeOwner, shapeType: $shapeType)
	}
`;
