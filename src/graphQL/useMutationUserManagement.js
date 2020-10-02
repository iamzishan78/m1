import gql from "graphql-tag";

export const UPSERTUSERMANAGEMENT = gql`
  mutation addUser($user: MSUserInput){
    addUser(user: $user)
  }
`;