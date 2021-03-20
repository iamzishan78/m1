import gql from "graphql-tag";

export const REMOVEWELLINTEREST = gql`
  mutation RemoveWellInterest(
    $id: ID,
  ) {
    removeWellInterest(
      id: $id,
    )
  }
`;
