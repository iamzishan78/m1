import gql from "graphql-tag";

export const GETBASINSHAPES = gql`
  query getBasinShapes($names: [String]) {
    basinShapes(names: $names)
  }
`;
