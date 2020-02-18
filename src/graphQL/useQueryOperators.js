import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export default function useQueryOperators() {

  const OPERATORSQUERY = gql`query {
    operators {
      Name
    }
  }`
      const { data,loading, error} = useQuery(OPERATORSQUERY);
    
      return {data,loading,error}

}