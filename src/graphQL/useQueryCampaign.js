import gql from 'graphql-tag';

export const GET_CAMPAIGN = gql`
	query getCampaign($campaignId: ID) {
		getCampaign(campaignId: $campaignId)
	}
`;
