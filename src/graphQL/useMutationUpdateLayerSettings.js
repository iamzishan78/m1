import gql from "graphql-tag";

export const UPDATELAYERSETTINGS = gql`
  mutation UpdateLayerSettings($settings: UserLayerSettingsInput) {
    updateUserLayerSettings(settings: $settings) {
      success
      error
      message
      res
    }
  }
`;

// Mutation to update all layer settings for the user
export const UPDATE_ALL_USER_LAYERS_SETTINGS = gql`
  mutation updateAllUserLayersVisibility($layersToShow: [String]) {
    updateAllUserLayersVisibility(layersToShow: $layersToShow)
  }
`;
