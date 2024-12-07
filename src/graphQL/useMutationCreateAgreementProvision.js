import gql from 'graphql-tag';

export const CREATE_AGREEMENT_PROVISION = gql`
	mutation upsertAgreementProvision($provision: JSON) {
		upsertAgreementProvision(provision: $provision)
	}
`;
