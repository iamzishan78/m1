import gql from "graphql-tag";

export const ABSTRACTWELLGEOQUERY = gql`
  query getAbstractWellGeo($polygon: String) {
    abstractWellGeo(polygon: $polygon)
  }
`;