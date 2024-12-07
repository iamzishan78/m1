import gql from 'graphql-tag';

export const GET_AGREEMENT_PROVISIONS = gql`
	query getAgreementProvisions($agreementId: ID) {
		getAgreementProvisions(agreementId: $agreementId)
	}
`;
