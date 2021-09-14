import gql from "graphql-tag";

export const ALLTAGGEDWELLSQUERY = gql`
  query getAllTaggedWells(
    $tagsArray: [String]
    $userId: ID
  ) {
    allTaggedWells(
      tagsArray: $tagsArray
      userId: $userId
    )
  }
`;
