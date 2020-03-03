import React from "react";
import gql from "graphql-tag";

export const PROJECTSQUERY = gql`
  query {
    projects {
      id
      name
      titleOpinions {
        id
      }
    }
  }
`;
