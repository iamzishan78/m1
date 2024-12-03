import gql from 'graphql-tag';

export const DELETEWELLFROMFILEDESCRIPTOR = gql`
	mutation deleteWellFromDescriptor($descriptorId: String, $wellGlobalId: String) {
		deleteWellFromFileDescriptor(descriptorId: $descriptorId, wellGlobalId: $wellGlobalId) {
			success
			message
		}
	}
`;
