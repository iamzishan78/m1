import gql from 'graphql-tag';

export const UPDATE_CAMPAIGN = gql`
	mutation upsertCampaign($campaign: JSON) {
		upsertCampaign(campaign: $campaign)
	}
`;

export const UPSERT_CAMPAIGN_DESCRIPTORS = gql`
	mutation upsertCampaignDescriptors($descriptors: [JSON]) {
		upsertCampaignDescriptors(descriptors: $descriptors)
	}
`;
export const UPSERT_ENTITY_CAMPAIGNS = gql`
	mutation upsertEntityCampaigns($campaigns: [JSON], $entityIds: [String], $entityType: String) {
		upsertEntityCampaigns(campaigns: $campaigns, entityIds: $entityIds, entityType: $entityType)
	}
`;

export const REMOVE_CAMPAIGN_FROM_CUSTOMLAYER = gql`
	mutation removeCampaignFromCustomLayer($campaignId: String, $customlayers: [JSON]) {
		removeCampaignFromCustomLayer(campaignId: $campaignId, customlayers: $customlayers)
	}
`;
