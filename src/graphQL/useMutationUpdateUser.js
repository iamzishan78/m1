import gql from "graphql-tag";

// TODO: remove this
export const UPDATEUSER = gql`
  mutation updateUser($user: MSUserInput!){
    updateUser(user: $user)
  }
`;