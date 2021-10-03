import gql from "graphql-tag";

export const GET_DEAL_SETTINGS = gql`
  query dealSettings($dealId: ID, $pipelineId: ID) {
    dealSettings(dealId: $dealId, pipelineId: $pipelineId)
  }
`;
