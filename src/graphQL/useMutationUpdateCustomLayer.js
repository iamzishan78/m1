import gql from "graphql-tag";

export const UPDATECUSTOMLAYER = gql`
  mutation updateCustomLayer(
    $customLayerId: ID
    $customLayer: CustomLayerInput
    $userId: JSON
  ) {
    updateCustomLayer(
      customLayerId: $customLayerId
      customLayer: $customLayer
      userId: $userId
    ) {
      success
      message
      error
      customLayer {
        _id
        shape
        shapeJson
        qtrQtrSelection
        name
        layer
        user {
          _id
          name
          email
        }
      }
    }
  }
`;
