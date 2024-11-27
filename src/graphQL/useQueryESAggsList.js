import gql from 'graphql-tag';

export const GET_ES_AGGS_LIST = gql`
	query getESAggsList(
		$esIndex: String
		$search: esSearchInput
		$filters: [JSON]
		$aggs: JSON
		$isElasticQuery: Boolean
	) {
		getESAggsList(esIndex: $esIndex, search: $search, filters: $filters, aggs: $aggs, isElasticQuery: $isElasticQuery)
	}
`;
