import gql from 'graphql-tag';

export const GET_PORTFOLIO_GROSS_REVENUE_SUMMARY = gql`
	query getPortfolioSummary($filters: [JSON], $filterDate: JSON) {
		getPortfolioSummary(filters: $filters, filterDate: $filterDate)
	}
`;
