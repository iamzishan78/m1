import gql from 'graphql-tag';

export const UPSERT_RELATED_PARTY = gql`
	mutation upsertRelatedParty($relatedParty: JSON, $customLayerId: ID) {
		upsertRelatedParty(relatedParty: $relatedParty, customLayerId: $customLayerId)
	}
`;

export const UPSERT_CONTACT_RELATED_AGREEMENT = gql`
	mutation upsertContactRelatedAgreement($relatedParty: JSON, $customLayerId: ID) {
		upsertContactRelatedAgreement(relatedParty: $relatedParty, customLayerId: $customLayerId)
	}
`;
