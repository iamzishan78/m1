import gql from 'graphql-tag';

export const UPSERT_AUTOMATION = gql`
	mutation upsertAutomation($automation: Automation) {
		upsertAutomation(automation: $automation)
	}
`;
