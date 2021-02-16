import React from "react";
import gql from "graphql-tag";

export const WELLOWNERSQUERY = gql`
  query getWellOwners($id: String $selectedYear:String) {
    wellOwners(wellId: $id selectedYear:$selectedYear) {
      id
      globalOwnerId
      name
      ownershipType
      interestType
      ownershipPercentage
      appraisedValue
    }
  }
`;
