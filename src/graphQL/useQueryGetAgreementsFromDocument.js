import gql from 'graphql-tag';

export const GET_AGREEMENTS_FROM_DOCUMENTS = gql`
	query GetAgreementDescriptors($descriptorObject: ID) {
		getAgreementDescriptors(descriptorObject: $descriptorObject) {
			_id
			shapeObj
		}
	}
`;
