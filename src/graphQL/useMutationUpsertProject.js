import React from "react";
import gql from "graphql-tag";

export const UPSERTPROJECT = gql`
  mutation UpsertProject($project: ProjectInput) {
    upsertProject(project: $project) {
      success
      message
      source {
        id
        name
      }
    }
  }
`;
