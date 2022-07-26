import gql from "graphql-tag";

export const UPDATE_CAMPAIGN = gql`
  mutation upsertCampaign($campaign: JSON) {
    upsertCampaign(campaign: $campaign)
  }
`;

export const UPSERT_CAMPAIGN_DESCRIPTOR = gql`
  mutation upsertCampaignDescriptor($descriptor: JSON) {
    upsertCampaignDescriptor(descriptor: $descriptor)
  }
`;