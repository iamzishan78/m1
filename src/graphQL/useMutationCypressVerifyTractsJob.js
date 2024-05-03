import gql from 'graphql-tag';

export const VERIFY_TRACTS_JOB = gql`
  mutation verifyTractsJob(
    $_id: String!
    $royalty_interest: String!
    $offer_price: String!
    $max_offer_price: String!
    $offer_price_nma: String!
    $max_offer_price_nma: String!
    $name: String!
  ) {
    verifyTractsJob(
      _id: $_id
      royalty_interest: $royalty_interest
      offer_price: $offer_price
      max_offer_price: $max_offer_price
      offer_price_nma: $offer_price_nma
      max_offer_price_nma: $max_offer_price_nma
      name: $name
    ) {
      success
      message
      data
    }
  }
`;
