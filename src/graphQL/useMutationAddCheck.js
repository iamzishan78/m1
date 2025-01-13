import gql from 'graphql-tag';

export const ADD_CHECK_DATA = gql`
	mutation addCheck($check: JSON) {
		addCheck(check: $check)
	}
`;
