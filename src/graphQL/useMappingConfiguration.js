import gql from 'graphql-tag';

// Query to get mappings by type
export const GET_MAPPINGS_BY_TYPE = gql`
	query getMappingsByType($type: String!) {
		getMappingsByType(type: $type) {
			name
			type
			mappings
			isDeleted
			createAt
			lastUpdateAt
		}
	}
`;

// Query to get mapping by name and type
export const GET_MAPPING_BY_NAME_AND_TYPE = gql`
	query getMappingByNameAndType($name: String!, $type: String!) {
		getMappingByNameAndType(name: $name, type: $type) {
			name
			type
			mappings
			isDeleted
			createAt
			lastUpdateAt
		}
	}
`;

// Mutation to create new mapping
export const CREATE_MAPPING = gql`
	mutation createMapping($input: MappingConfigurationInput!) {
		createMapping(input: $input) {
			name
			type
			mappings
			isDeleted
			createAt
			lastUpdateAt
		}
	}
`;

// Mutation to update existing mapping
export const UPDATE_MAPPING = gql`
	mutation updateMapping($name: String!, $type: String!, $input: MappingConfigurationUpdateInput!) {
		updateMapping(name: $name, type: $type, input: $input) {
			name
			type
			mappings
			isDeleted
			createAt
			lastUpdateAt
		}
	}
`;

// Mutation to delete mapping
export const DELETE_MAPPING = gql`
	mutation deleteMapping($name: String!, $type: String!) {
		deleteMapping(name: $name, type: $type) {
			name
			type
			mappings
			isDeleted
			createAt
			lastUpdateAt
		}
	}
`;
