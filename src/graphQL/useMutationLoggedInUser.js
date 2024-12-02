import gql from 'graphql-tag';

export const GET_LOGGED_IN_USER = gql`
	mutation getLoggedInUser($user: UserInput) {
		login(user: $user) {
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
			}
		}
	}
`;
