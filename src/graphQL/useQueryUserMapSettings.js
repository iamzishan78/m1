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
