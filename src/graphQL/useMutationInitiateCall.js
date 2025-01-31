import gql from 'graphql-tag';

export const INITIATE_DIALPAD_CALL = gql`
	mutation initiateDialpadCall($phoneNumber: String) {
		initiateDialpadCall(phoneNumber: $phoneNumber) {
			success
			message
		}
	}
`;
