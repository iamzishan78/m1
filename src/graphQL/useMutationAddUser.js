import gql from "graphql-tag";

export const ADDUSER = gql`
  mutation addUser($user: MSUserInput!){
    addUser(user: $user)
  }
`;