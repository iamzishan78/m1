import gql from 'graphql-tag';

export const DELETE_PROPERTY_FROM_FILE_DESCRIPTOR = gql`
	mutation deletePropertyFromFileDescriptor($descriptorId: String, $propertyId: String) {
		deletePropertyFromFileDescriptor(descriptorId: $descriptorId, propertyId: $propertyId) {
			success
			message
		}
	}
`;
