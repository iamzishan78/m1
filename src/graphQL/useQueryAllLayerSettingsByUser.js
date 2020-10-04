import gql from "graphql-tag";

export const ALLLAYERSETTINGSBYUSER = gql`
  query getAllLayerSettingsByUser($userId: ID, $defaultLayers: JSON) {
    allLayerSettingsByUser(userId: $userId, defaultLayers: $defaultLayers)
  }
`;
