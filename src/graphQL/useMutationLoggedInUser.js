
export const GET_LOGGED_IN_USER = `
  mutation getLoggedInUser($user: UserInput) {
    login(user: $user) {
      success
      message
      error
      sessionData
      user {
        _id
        email
        name
        displayName
        adUserId
        rolePrivileges
        }
      }
    }
 `;
