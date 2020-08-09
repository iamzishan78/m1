import gql from "graphql-tag";

export const ABSTRACTGEOQUERY = gql`
  query getAbstractGeo($polygon: String) {
    abstractGeo(polygon: $polygon)
  }
`;