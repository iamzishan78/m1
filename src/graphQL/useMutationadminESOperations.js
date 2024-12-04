import gql from 'graphql-tag';

export const TRIGGER_ADMIN_OPERATIONS = gql`
	mutation triggerAdminOperation($options: JSON) {
		triggerAdminOperation(options: $options)
	}
`;
