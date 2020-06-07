import React from "react";
import gql from "graphql-tag";

export const DROPVERTEXQUERY = gql`
  mutation dropGraphVertex($vertex: VertexInput) {
    dropVertex(vertes: $svertex) {
      success
      message
    }
  }
`;
