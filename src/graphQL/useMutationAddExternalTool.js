import gql from 'graphql-tag';

export const ADD_EXTERNAL_TOOL = gql`
	mutation addExternalTool($toolName: String, $apikey: String, $webhookUrl: String) {
		addExternalTool(toolName: $toolName, apikey: $apikey, webhookUrl: $webhookUrl) {
			success
		}
	}
`;
