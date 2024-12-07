import gql from 'graphql-tag';

export const GET_RELATED_PARTIES = gql`
	query getRelatedParties($customLayerId: ID) {
		getRelatedParties(customLayerId: $customLayerId)
	}
`;
