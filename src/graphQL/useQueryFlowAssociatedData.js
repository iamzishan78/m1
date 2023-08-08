import gql from "graphql-tag";

export const GET_FLOW_ASSOCIATED_SUMMARY = gql`
  query flowDealSummary($contactIds: [ID]!, $dealId: ID) {
    flowDealSummary(
      contactIds: $contactIds,
      dealId: $dealId
    ),
  }
`;
