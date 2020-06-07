import gql from "graphql-tag";

export const UPSERTCUSTOMLAYER = gql`
  mutation UpsertCustomLayer($customLayer: CustomLayerInput) {
    upsertCustomLayer(customLayer: $customLayer) {
      success
      message
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
