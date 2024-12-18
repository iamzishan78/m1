import gql from 'graphql-tag';

export const GET_DB_OPERATIONS = gql`
	query getDBOperations($options: JSON) {
		getDBOperations(options: $options)
	}
`;
