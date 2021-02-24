import gql from "graphql-tag";

export const TRACKSWELL = gql`
  query tracksWell {
    tracksWell {
      _id
      ts
      user
      objectType
      trackOn
    }
  }
`;
