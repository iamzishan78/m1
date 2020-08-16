import gql from "graphql-tag";

export const ABSTRACTGEOCONTAINSQUERY = gql`
  query getAbstractGeoContains($polygon: String) {
    abstractGeoContains(polygon: $polygon)
  }
`;