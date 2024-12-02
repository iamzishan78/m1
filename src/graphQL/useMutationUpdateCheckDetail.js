import gql from 'graphql-tag';

export const UPDATE_CHECK_DETAIL = gql`
	mutation updateCheckDetail($checkDetail: JSON) {
		updateCheckDetail(checkDetail: $checkDetail)
	}
`;
