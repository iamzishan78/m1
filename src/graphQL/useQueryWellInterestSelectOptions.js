import gql from 'graphql-tag';

export const WELL_INTEREST_SELECT_OPTIONS = gql`
	query getWellInterestsSelectOptions($selectKeys: [String]) {
		wellInterestsSelectOptions(selectKeys: $selectKeys)
	}
`;
