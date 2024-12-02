import gql from 'graphql-tag';

export const GET_WORKSPACE_SETTINGS = gql`
	query getWorkspaceSettings($workspaceName: String) {
		workspaceSettings(workspaceName: $workspaceName)
	}
`;
