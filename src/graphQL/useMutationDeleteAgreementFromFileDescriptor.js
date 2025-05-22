import gql from 'graphql-tag';

export const DELETE_AGREEMENT_FROM_FILE_DESCRIPTOR = gql`
	mutation DeleteAgreementFromFileDescriptor($descriptorId: String, $shapeId: String) {
		deleteAgreementFromFileDescriptor(descriptorId: $descriptorId, shapeId: $shapeId) {
			_id
			message
			success
		}
	}
`;
