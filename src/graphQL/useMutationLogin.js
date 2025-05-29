import gql from 'graphql-tag';

export const LOGIN_MUTATION = gql`
	mutation login($email: String) {
		login(email: $email) {
			success
			message
			sessionData
			user {
				_id
				email
				name
				displayName
				adUserId
				rolePrivileges
				roles
				featureSettings
				dialpad
			}
		}
	}
`;

export const SIMPLE_BYPASS_LOGIN_MUTATION = gql`
	mutation simpleBypassLogin($email: String) {
		simpleBypassLogin(email: $email) {
			success
			message
			sessionData
			user {
				_id
				email
				name
				displayName
				adUserId
				rolePrivileges
				roles
				featureSettings
				dialpad
			}
		}
	}
`;
