import gql from "graphql-tag";

export const UPDATEMANYLAYERSETTINGS = gql`
  mutation UpdateManyLayerSettings($manySettings: [UserLayerSettingsInput]) {
    updateManyUserLayerSettings(manySettings: $manySettings) {
      success
      error
      message
      res
    }
  }
`;
