import gql from 'graphql-tag';

export const GET_ACTIVITY_TYPES = gql`
	query getActivityTypes($category: String) {
		activityTypes(category: $category)
	}
`;
