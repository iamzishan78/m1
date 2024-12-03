import gql from 'graphql-tag';

export const UPSERT_WORKSPACE_SETTINGS = gql`
	mutation addOrUpdateWorkspaceSettings($workspaceSettings: JSON) {
		upsertWorkspaceSettings(workspaceSettings: $workspaceSettings)
	}
`;
