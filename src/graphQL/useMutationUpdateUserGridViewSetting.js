import gql from 'graphql-tag';

export const UPDATE_USER_GRID_VIEW_SETTING_MUTATION = gql`
	mutation updateUserGridViewSetting($userGridViewSetting: JSON) {
		updateUserGridViewSetting(userGridViewSetting: $userGridViewSetting)
	}
`;
