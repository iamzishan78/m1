
export const GET_LOGGED_IN_USER = `
  mutation getLoggedInUser($user: UserInput) {
    login(user: $user) {
      success
      message
      sessionData
      user {
        _id
        email
        name
        }
      }
    }
 `;
