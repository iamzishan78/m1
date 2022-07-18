import gql from "graphql-tag";

export const ADD_CAMPAIGN = gql`
  mutation addCampaign($campaign: JSON) {
    addCampaign(campaign: $campaign)
  }
`;
