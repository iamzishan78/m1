import gql from 'graphql-tag';

export const UPDATE_PROPERTY_INTEREST = gql`
	mutation updatePropertyInterest($propertyInterest: JSON) {
		updatePropertyInterest(propertyInterest: $propertyInterest)
	}
`;
