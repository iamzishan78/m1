import gql from "graphql-tag";

export const WELLGRID = gql`
  query getWellGrId12345($gridNumber: Int, $whereFields: JSON) {
    WellGrId12345(gridNumber: $gridNumber, whereFields: $whereFields)
  }
`;
