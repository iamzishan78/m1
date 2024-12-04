import gql from 'graphql-tag';

export const GET_CHECK_PURCHASE_DATA = gql`
	query getCheckPurchaseData($contactIds: JSON) {
		getCheckPurchaseData(contactIds: $contactIds)
	}
`;
