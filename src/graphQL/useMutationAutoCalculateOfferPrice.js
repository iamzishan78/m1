import gql from 'graphql-tag';

export const AUTO_CALCULATE_OFFER_PRICE = gql`
	mutation autoCalculateOfferPrice($shapeOwnerId: ID) {
		autoCalculateOfferPrice(shapeOwnerId: $shapeOwnerId)
	}
`;
