import gql from 'graphql-tag';

export const WELLSOWNERSQUERY = gql`
	query getWellsOwners($api: [String]) {
		wellsOwners(wellIdArray: $api)
	}
`;
