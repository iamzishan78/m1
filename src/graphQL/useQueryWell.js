import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export default function useQueryWell(api) {

  const WELLQUERY = gql`query {
    well(wellId:"${api}") {
      wellName
    }
  }`
      const { data,loading, error} = useQuery(WELLQUERY);
    
      return {data,loading,error}

}