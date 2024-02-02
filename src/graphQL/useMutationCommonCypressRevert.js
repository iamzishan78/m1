import gql from 'graphql-tag';

export const REVERTCYPRESSDELETE = gql`
	mutation revertCypressDelete($data: JSON) {
		revertCypressDelete(data: $data) {
			success
			message
		}
	}
`;