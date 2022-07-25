import gql from "graphql-tag";

export const UPDATE_CAMPAIGN = gql`
  mutation upsertCampaign($campaign: JSON) {
    upsertCampaign(campaign: $campaign)
  }
`;
