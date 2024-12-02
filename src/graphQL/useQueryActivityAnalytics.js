import gql from 'graphql-tag';

export const GET_ACTIVITY_ANALYTICS = gql`
	query getActivityAnalytics($search: esSearchInput, $filters: [esFilterInput]) {
		getActivityAnalytics(search: $search, filters: $filters)
	}
`;
