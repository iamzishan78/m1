import gql from 'graphql-tag';

export const ASSIGN_OWNER_TO_CONTACT = gql`
	mutation assignOwnerToContact($contactIds: [ID], $shapeOwnerIds: [ID], $contactOwner: ID, $userId: ID) {
		assignOwnerToContact(
			contactIds: $contactIds
			shapeOwnerIds: $shapeOwnerIds
			contactOwner: $contactOwner
			userId: $userId
		)
	}
`;
