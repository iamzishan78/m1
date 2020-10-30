import React from "react";
import gql from "graphql-tag";

export const OWNERSQUERY = gql`
  query getOwners($ownerIdArray: [String]) {
    owners(ownerIdArray: $ownerIdArray)
  }
`;
