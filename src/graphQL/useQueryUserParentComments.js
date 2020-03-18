import React from "react";
import gql from "graphql-tag";

export const USERPARENTCOMMENTSQUERY = gql`
  query getUserParentComments($sourceSourceId: ID, $targetSourceId: ID) {
    userParentComments(
      sourceSourceId: $sourceSourceId
      targetSourceId: $targetSourceId
    )
  }
`;
