import gql from "graphql-tag";

export const USER_MAP_SETTINGS = gql`
  query getUserMapSettings($user: ID, $type: String) {
    userMapSettings(user: $user, type: $type) {
      success
      error
      message
      settings
    }
  }
`;
