import gql from 'graphql-tag';

export const GET_VALIDATION_CHECK = gql`
	query getRevenueValidationCheck($checkIds: JSON) {
		getRevenueValidationCheck(checkIds: $checkIds)
	}
`;
