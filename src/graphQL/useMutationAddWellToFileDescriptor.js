import gql from 'graphql-tag';

export const ADD_WELL_TO_FILE_DESCRIPTOR = gql`
	mutation addWellToFileDescriptor($descriptorId: String, $wellData: JSON) {
		addWellToFileDescriptor(descriptorId: $descriptorId, wellData: $wellData) {
			success
			message
			_id
		}
	}
`;
