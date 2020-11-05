import React from "react";
import gql from "graphql-tag";

export const OWNER_WELLINTERESTS = gql`
  query getOwner_WellInterests($id: String) {
    owner_WellInterests(id: $id)
  }
`;
