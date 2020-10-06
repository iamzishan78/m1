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
