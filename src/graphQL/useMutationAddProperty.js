import gql from 'graphql-tag';

export const ADD_PROPERTY = gql`
	mutation addProperty($property: JSON) {
		addProperty(property: $property) {
			success
			error
			message
			property
		}
	}
`;
