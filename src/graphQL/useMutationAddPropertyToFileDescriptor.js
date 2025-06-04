import gql from 'graphql-tag';

export const ADD_PROPERTY_TO_FILE_DESCRIPTOR = gql`
	mutation AddPropertyToFileDescriptor($descriptorId: String, $propertyData: JSON) {
		addPropertyToFileDescriptor(descriptorId: $descriptorId, propertyData: $propertyData) {
			_id
			message
			success
		}
	}
`;
