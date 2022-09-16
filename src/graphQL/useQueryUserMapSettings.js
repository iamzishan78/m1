import gql from "graphql-tag";

export const USER_MAP_SETTINGS = `
  query getUserMapSettings($user: ID, $type: String) {
    userMapSettings(user: $user, type: $type) {
      success
      error
      message
      settings
    }
  }
`;


export const USER_MAP_SETTINGS_QUERY = gql`
  query getUserMapSettings($user: ID, $type: String) {
    userMapSettings(user: $user, type: $type) {
      success
      error
      message
      settings
    }
  }
`;

