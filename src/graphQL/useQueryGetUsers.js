import gql from "graphql-tag";

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
