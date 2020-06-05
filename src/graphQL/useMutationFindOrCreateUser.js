import gql from "graphql-tag";

export const FINDORCREATEUSER = gql`
  mutation getFindOrCreateUser($user: UserInput) {
    findOrCreateUser(user: $user) {
      success
      message
      user {
        _id
        email
        name
      }
    }
  }
`;
