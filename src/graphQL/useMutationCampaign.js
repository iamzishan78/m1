import gql from "graphql-tag";

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