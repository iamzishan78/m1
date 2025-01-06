import gql from 'graphql-tag';

export const SYNC_DIALPAD = gql`
	mutation syncDialpad($toolName: String) {
		syncDialpad(toolName: $toolName) {
			success
		}
	}
`;
