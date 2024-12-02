import gql from 'graphql-tag';

export const REMOVE_AGREEMENTS = gql`
	mutation removeAgreements($agreementIds: [ID], $userId: String) {
		removeAgreements(agreementIds: $agreementIds, userId: $userId) {
			success
			message
			error
			agreement
		}
	}
`;
