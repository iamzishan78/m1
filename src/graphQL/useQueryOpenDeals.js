import gql from 'graphql-tag';

export const OPENDEALS = gql`
	query getOpenDeals {
		openDeals {
			success
			error
			message
			deals
			deal
		}
	}
`;
