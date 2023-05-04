import gql from "graphql-tag";

export const GET_FLOW_ASSOCIATED_SUMMARY = gql`
  query flowDealSummary($contactIds: [ID]!) {
    flowDealSummary(
      contactIds: $contactIds,
    ),
  }
`;
