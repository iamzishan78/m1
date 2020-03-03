import React from "react";
import gql from "graphql-tag";

export const UPSERTTITLEOPINION = gql`
  mutation UpsertTitleOpinion($titleOpinion: TitleOpinionInput) {
    upsertTitleOpinion(titleOpinion: $titleOpinion) {
      success
      message
      source {
        id
        legalDescription
        preparedBy
        certifiedDate
        state
        county
        generalNotes
        MORSections
        RunSheetSections
      }
    }
  }
`;
