import gql from 'graphql-tag';

export const REMOVECOMMONGRIDFUNCTIONALITY = gql`
	mutation gridGenericRemove($modal: String, $Ids: [ID]) {
		gridGenericRemove(modal: $modal, Ids: $Ids) {
			success
			message
			error
		}
	}
`;
