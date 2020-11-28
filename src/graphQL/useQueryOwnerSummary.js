import gql from "graphql-tag";

export const OWNERSUMMARY = gql`
  query getOwnerSummary($id: String) {
    ownerSummary(id: $id)
  }
`;
