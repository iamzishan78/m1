import gql from "graphql-tag";

export const PLSSSECONDDIVISIONGEO = gql`
  query getPLSSSecondDivisionGeo($polygon: String) {
    plssSecondDivisionGeo(polygon: $polygon)
  }
`;