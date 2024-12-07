import gql from 'graphql-tag';

export const DELETE_REVENUE_PROPERTIES = gql`
	mutation removeProperties($properties: [String]) {
		removeProperties(properties: $properties)
	}
`;
