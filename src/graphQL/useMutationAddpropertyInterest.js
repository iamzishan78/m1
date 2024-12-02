import gql from 'graphql-tag';

export const ADD_PROPERTY_INTEREST = gql`
	mutation addPropertyInterest($propertyInterest: JSON) {
		addPropertyInterest(propertyInterest: $propertyInterest)
	}
`;
