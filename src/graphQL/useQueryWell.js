import React from "react";
import gql from "graphql-tag";

export const WELLQUERY = gql`
  query getWell($wellId: String) {
    well(wellId: $wellId) {
      id
      wellName
      api
      operator
      wellType
      latitude
      longitude
      wellBoreProfile
      ownerCount

      wellStatus
      lastTwelveMonthBOE
      permitApprovedDate
      spudDate
      completionDate
      firstProductionDate
    }
  }
`;
