import gql from 'graphql-tag';

export const EXTERNAL_TOOL_EXISTS = gql`
	query externalToolExists($toolName: String) {
		externalToolExists(toolName: $toolName) {
			success
		}
	}
`;
