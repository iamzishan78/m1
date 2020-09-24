import gql from "graphql-tag";

export const GETUSERS = gql`
  query getAllUsers {
    allUsers
  }
`;
