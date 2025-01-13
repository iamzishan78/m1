import gql from 'graphql-tag';

export const UPDATE_CHECK_DATA = gql`
	mutation updateCheck($check: JSON) {
		updateCheck(check: $check)
	}
`;
