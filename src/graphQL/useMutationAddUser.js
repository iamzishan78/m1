import gql from "graphql-tag";

// TODO: remove this
export const ADDUSER = gql`
  mutation addUser($user: MSUserInput!){
    addUser(user: $user)
  }
`;