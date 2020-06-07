import React from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export default function useQueryCountiesByState(state) {
  const CountiesByStateQUERY = gql`query {
    counties(state:"${state}") {
      county
      state
    }
  }`;

  return useLazyQuery(CountiesByStateQUERY);
}