import React from "react";
import gql from "graphql-tag";

export const WELLOWNERSQUERY = gql`
  query getWellOwners($id: String, $selectedYear:String) {
    wellOwners(wellId: $id, selectedYear:$selectedYear) {
      id
      globalOwnerId
      name
      StreetAddress
      City
      State
      Zip
      ownershipType
      interestType
      ownershipPercentage
      appraisedValue
    }
  }
`;
