import gql from "graphql-tag";

// TODO: remove this
export const GETUSERS = gql`
  query getAllUsers {
    allUsers
  }
`;

export const GETMONGOUSERS = gql`
  query getAllMongoUsers {
    allMongoUsers {
      _id
      email
      name
      displayName
      ts
    }
  }
`;
