import gql from 'graphql-tag';

export const UPSERT_CHECK_PROPERTY = gql`
	mutation upsertCheckProperty($propertyNumber: String, $checksIds: [String]) {
		upsertCheckProperty(propertyNumber: $propertyNumber, checksIds: $checksIds)
	}
`;
