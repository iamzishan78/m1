import gql from "graphql-tag";

export const UPDATECUSTOMLAYER = gql`
  mutation updateCustomLayer(
    $customLayerId: ID
    $customLayer: CustomLayerInput
  ) {
    updateCustomLayer(
      customLayerId: $customLayerId
      customLayer: $customLayer
    ) {
      success
      message
      error
      customLayer {
        _id
        shape
        name
        layer
        user {
          name
          email
        }
      }
    }
  }
`;
