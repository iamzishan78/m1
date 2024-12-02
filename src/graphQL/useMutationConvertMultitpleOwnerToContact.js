import gql from 'graphql-tag';

export const CONVERT_MULTITPLE_OWNER_TO_CONTACT = gql`
	mutation convertMultitpleOwnerToContact(
		$ownerIds: JSON
		$existingContactId: ID
		$status: String
		$contactOwner: ID
		$action: String
		$userId: ID
		$tagsIds: JSON
		$entitiesIds: JSON
	) {
		convertMultitpleOwnerToContact(
			ownerIds: $ownerIds
			existingContactId: $existingContactId
			status: $status
			contactOwner: $contactOwner
			action: $action
			userId: $userId
			tagsIds: $tagsIds
			entitiesIds: $entitiesIds
		)
	}
`;
