import gql from 'graphql-tag';

// Query for getting a single user
export const GET_USER = gql`
	query user($userId: ID!) {
		user(id: $userId) {
			_id
			email
			displayName
			role
			roles
			rolePrivileges
			ts
			featureSettings
		}
	}
`;

// Query for getting all users
export const GET_ALL_USERS = gql`
	query users {
		users {
			_id
			email
			displayName
			role
			roles
			rolePrivileges
			ts
			featureSettings
		}
	}
`;

// Mutation for adding a user
export const ADD_USER = gql`
	mutation addUser($user: MSUserInput!) {
		addUser(user: $user) {
			_id
			email
			displayName
			role
			roles
			ts
			featureSettings
		}
	}
`;

// Mutation for updating a user
export const UPDATE_USER = gql`
	mutation updateUser($user: MSUserInput!) {
		updateUser(user: $user) {
			_id
			email
			displayName
			role
			roles
			ts
			featureSettings
		}
	}
`;

// Mutation for removing users
export const REMOVE_USERS = gql`
	mutation removeUsers($userIds: [ID], $orgId: String) {
		removeUsers(userIds: $userIds, orgId: $orgId) {
			_id
			email
			displayName
			role
			roles
			ts
			featureSettings
		}
	}
`;
