import gql from 'graphql-tag';

export const SYNC_DIALPAD = gql`
	mutation syncDialpad($toolName: String, $requestPayload: JSON) {
		syncDialpad(toolName: $toolName, requestPayload: $requestPayload) {
			success
		}
	}
`;
