import gql from "graphql-tag";

export const WELLSMINMAXLATLONG = gql`
  query getWellsMinMaxLatLong($whereFields: JSON) {
    wellsMinMaxLatLong(whereFields: $whereFields)
  }
`;
