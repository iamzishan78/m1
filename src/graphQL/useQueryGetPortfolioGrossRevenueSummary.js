import gql from "graphql-tag";

export const GET_PORTFOLIO_GROSS_REVENUE_SUMMARY = gql`
  query getPortfolioGrossRevenueSummary($filters :[JSON]) {
    getPortfolioGrossRevenueSummary(filters: $filters)
  }
`;
