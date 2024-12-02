import gql from 'graphql-tag';

export const GET_ES_AGGS_LIST = gql`
	query getESAggsList($esIndex: String, $search: esSearchInput, $fields: [JSON], $filters: [JSON], $aggs: JSON) {
		getESAggsList(esIndex: $esIndex, search: $search, fields: $fields, filters: $filters, aggs: $aggs)
	}
`;
