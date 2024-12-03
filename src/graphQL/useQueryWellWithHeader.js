import gql from 'graphql-tag';

export const WELL_SUMMARY_WITH_HEADER = gql`
	query getWellSummaryWithHeaderDetails($globalWellId: String) {
		wellSummaryWithHeaderDetails(globalWellId: $globalWellId)
	}
`;
