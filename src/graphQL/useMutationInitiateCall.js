import gql from 'graphql-tag';

export const INITIATE_DIALPAD_CALL = gql`
	mutation initiateDialpadCall($phoneNumber: String, $dialpadUserId: String) {
		initiateDialpadCall(phoneNumber: $phoneNumber, dialpadUserId: $dialpadUserId) {
			success
			message
		}
	}
`;
