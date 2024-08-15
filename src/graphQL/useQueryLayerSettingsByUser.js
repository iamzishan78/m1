import gql from "graphql-tag";

export const LAYERSETTINGSBYUSER = gql`
  query getLayerSettingsByUser($userId: ID, $identifier: String) {
    layerSettingsByUser(userId: $userId, identifier: $identifier)
  }
`;
