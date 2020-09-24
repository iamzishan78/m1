import gql from "graphql-tag";

export const UPDATELAYERSTATE = gql`
  mutation UpdateLayerState($userId: ID $layersState: LayersStateInput) {
    updateLayersState(userId: $userId layersState: $layersState) {
      success
      error
      message
      layerState {
        _id
        layersConfig
        user {
          name
          email
        }
      }
    }
  }
`;
