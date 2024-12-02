import gql from 'graphql-tag';

export const GET_ES_POTENTIAL_ISSUES_SUMMARY = gql`
	query getESPotentialIssuesSummary(
		$search: esSearchInput
		$filters: [esFilterInput]
		$sort: esSortInput
		$pagination: esPaginationInput
	) {
		getESPotentialIssuesSummary(search: $search, sort: $sort, filters: $filters, pagination: $pagination)
	}
`;
