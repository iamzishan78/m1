import gql from 'graphql-tag';

export const GET_ES_CONTACTS = gql`
	query getESContacts($search: String, $sort: JSON, $pagination: JSON, $filters: [JSON]) {
		getESContacts(search: $search, sort: $sort, pagination: $pagination, filters: $filters)
	}
`;
