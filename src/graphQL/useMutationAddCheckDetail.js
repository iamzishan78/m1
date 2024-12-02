import gql from 'graphql-tag';

export const ADD_CHECK_DETAIL = gql`
	mutation addCheckDetail($checkDetail: JSON) {
		addCheckDetail(checkDetail: $checkDetail)
	}
`;
