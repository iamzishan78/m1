import gql from 'graphql-tag';

export const GET_ES_CONTACTS_FILTER = gql`
	query getESContactsFilter($filterKeys: JSON, $filterKey: String, $search: String, $size: Int) {
		getESContactsFilter(filterKeys: $filterKeys, filterKey: $filterKey, search: $search, size: $size)
	}
`;
