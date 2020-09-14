<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< master
import React from 'react';
import { useQuery } from "@apollo/client";
========================================================================
import React from "react";
import { useQuery } from "@apollo/react-hooks";
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> issue/quad_chart
import gql from "graphql-tag";

export default function useQueryQuadChart(id) {
  const QUADCHARTQUERY = gql`query {
    quadChart(wellId:"${id}") {
            quadrant
            metric
            units
            value1
            value6
            value12 
            cumulative
    }
  }`;
  const { data, loading, error } = useQuery(QUADCHARTQUERY);
  return { data, loading, error };
}
