import gql from "graphql-tag";

export const GETUSERS = gql`
  query getAllUsers {
    allUsers
  }
`;

export const GETMONGOUSERS = gql`
  query getAllMongoUsers {
    allUsers: allUsersFromMongo
  }
`;
