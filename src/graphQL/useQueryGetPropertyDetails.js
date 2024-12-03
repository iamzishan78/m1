import gql from 'graphql-tag';

export const GET_PROPERTY_DETAILS = gql`
	query getPropertyDetails($id: ID) {
		getPropertyDetails(id: $id)
	}
`;
