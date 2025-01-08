import gql from 'graphql-tag';

export const RESET_OWNERS_CALCULATED_VALUES = gql`
	mutation resetOwnersCalculatedValues($ownerIds: JSON, $layerId: ID) {
		resetOwnersCalculatedValues(ownerIds: $ownerIds, layerId: $layerId)
	}
`;
