import React from "react";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";

export default function useQuerySurveyByCounty(county) {
  const SurveysByCountyQUERY = gql`query {
    surveys(county:"${county}") {
      survey
      county
    }
  }`;

  return useLazyQuery(SurveysByCountyQUERY);
}
