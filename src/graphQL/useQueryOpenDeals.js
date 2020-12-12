import gql from "graphql-tag";

export const OPENDEALS = gql`
  query getOpenDeals {
    openDeals {
      deals {
        _id
        name
        ts
      }
    }
  }
`;
