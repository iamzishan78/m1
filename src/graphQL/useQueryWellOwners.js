import React from "react";
import gql from "graphql-tag";

export const WELLOWNERSQUERY = gql`
  query getWellOwners($id: String) {
    wellOwners(wellId: $id) {
      id
      name
      ownershipType
      interestType
      ownershipPercentage
      appraisedValue
    }
  }
`;
