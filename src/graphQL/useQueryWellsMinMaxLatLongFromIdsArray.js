import gql from "graphql-tag";

export const WELLSMINMAXLATLONGFROMIDSARRAY = gql`
  query getWellsMinMaxLatLongFromIdsArray($idsArray: [String]) {
    wellsMinMaxLatLongFromIdsArray(idsArray: $idsArray)
  }
`;
