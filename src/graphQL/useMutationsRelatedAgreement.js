import gql from 'graphql-tag';

export const UPSERT_RELATED_AGREEMENT_DESSCRIPTOR = gql`
	mutation upsertRelatedAgreementDescriptor(
		$descriptorObject: ID
		$relatedObject: ID
		$descriptorType: String
		$relatedObjectType: String
	) {
		upsertRelatedAgreementDescriptor(
			descriptorObject: $descriptorObject
			relatedObject: $relatedObject
			descriptorType: $descriptorType
			relatedObjectType: $relatedObjectType
		)
	}
`;

export const DELETE_RELATED_AGREEMENTS = gql`
	mutation deleteRelatedAgreements($currentAgreementId: ID, $agreementIds: [ID]) {
		deleteRelatedAgreements(currentAgreementId: $currentAgreementId, agreementIds: $agreementIds)
	}
`;
