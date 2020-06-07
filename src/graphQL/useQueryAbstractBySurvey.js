import React from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export default function useQueryAbstractBySurvey(survey) {
  const AbstractBySurveyQUERY = gql`query {
    abstracts(survey:"${survey}") {
        abstract
        survey
    }
  }`;

  return useLazyQuery(AbstractBySurveyQUERY);
}
