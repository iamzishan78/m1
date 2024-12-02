import gql from 'graphql-tag';

export const GETCHECK = gql`
	query getCheck($id: ID) {
		getCheck(checkId: $id)
	}
`;
