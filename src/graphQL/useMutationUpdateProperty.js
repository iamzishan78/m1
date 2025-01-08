import gql from 'graphql-tag';

export const UPDATE_PROPERTY = gql`
	mutation updateProperty($property: JSON) {
		updateProperty(property: $property) {
			success
			error
			message
			property
		}
	}
`;
