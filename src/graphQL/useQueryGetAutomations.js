import gql from 'graphql-tag';

export const GET_AUTOMATIONS = gql`
	query getAutomations($userId: ID, $type: String) {
		getAutomations(userId: $userId, type: $type)
	}
`;
