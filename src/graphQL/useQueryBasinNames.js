import gql from "graphql-tag";

export const BASINNAMESQUERY = gql`
  query getBasinNames {
    basinNames
  }
`;