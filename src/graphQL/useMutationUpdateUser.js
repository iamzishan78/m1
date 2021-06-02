import gql from "graphql-tag";

export const UPDATEUSER = gql`
  mutation updateUser($user: MSUserInput!){
    updateUser(user: $user)
  }
`;