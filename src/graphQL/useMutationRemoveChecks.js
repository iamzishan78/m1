import gql from 'graphql-tag';

export const REMOVE_CHECKS = gql`
	mutation removeChecks($checkIds: [ID]) {
		removeChecks(checkIds: $checkIds)
	}
`;
