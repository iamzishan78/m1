import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export default function useQueryProdHistory(api) {

  const WELLPRODHISTORYQUERY = gql`query {
    wellProdHistory(wellId:"${api}") {
            year
            month
            reportDate
            gas
            oil
            water
    }
  }`
      const { data,loading, error} = useQuery(WELLPRODHISTORYQUERY);
    
      return {data,loading,error}

}