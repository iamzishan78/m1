import gql from "graphql-tag";

export const ALLLAYERSETTINGSBYUSER = gql`
  query getAllLayerSettingsByUser($userId: ID) {
    allLayerSettingsByUser(userId: $userId)
  }
`;
