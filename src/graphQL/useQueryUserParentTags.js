import React from "react";
import gql from "graphql-tag";

export const USERPARENTTAGSQUERY = gql`
  query getUserParentTags($sourceSourceId: ID, $targetSourceId: ID) {
    userParentTags(
      sourceSourceId: $sourceSourceId
      targetSourceId: $targetSourceId
    )
  }
`;
