import gql from 'graphql-tag';

export const UPDATE_USER_MAP_SETTINGS = gql`
	mutation updateUserMapSettings($settings: UserMapSettingsInput) {
		updateUserMapSettings(settings: $settings) {
			success
			error
			message
			settings
		}
	}
`;
