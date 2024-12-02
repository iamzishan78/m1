import gql from 'graphql-tag';

export const GET_CAMPAIGN_ANALYTICS = gql`
	query getCampaignAnalytics($search: esSearchInput, $filters: [esFilterInput]) {
		campaignAnalytics(search: $search, filters: $filters)
	}
`;
