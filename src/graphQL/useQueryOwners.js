import gql from 'graphql-tag';

export const OWNERSQUERY = gql`
	query getOwners($ownerIdArray: [String]) {
		owners(ownerIdArray: $ownerIdArray)
	}
`;

export const OWNER_BY_ID_QUERY = gql`
	query getOwner($id: String) {
		owner(id: $id)
	}
`;
