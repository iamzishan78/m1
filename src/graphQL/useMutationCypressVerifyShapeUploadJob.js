import gql from 'graphql-tag';

export const VERIFY_SHAPE_UPLOAD_JOB = gql`
  mutation verifyShapeUploadJob(
    $_id: String!
    $royalty_interest: String
    $offer_price: String
    $max_offer_price: String
    $offer_price_nma: String
    $max_offer_price_nma: String
    $name: String!
    $uAcres: String
    $uUnitPricing: String
    $nra: String
    $campaignName: String
    $shapeType: String!
  ) {
    verifyShapeUploadJob(
      _id: $_id
      royalty_interest: $royalty_interest
      offer_price: $offer_price
      max_offer_price: $max_offer_price
      offer_price_nma: $offer_price_nma
      max_offer_price_nma: $max_offer_price_nma
      name: $name
      uAcres: $uAcres
      uUnitPricing: $uUnitPricing
      nra: $nra
      campaignName: $campaignName
      shapeType: $shapeType
    ) {
      success
      message
      data
    }
  }
`;
