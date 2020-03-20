import React from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export default function useQueryProdHistory(token) {

  const PRODRANGEQUERY = gql`query {
    wellsRanges(authToken:"${token}") {
        permitDate
        spudDate
        completionDate
        firstProdDate
        cumulativeOil
        cumulativeGas
        cumulativeWater
        firstMonthProdOil
        firstMonthProdGas
        firstMonthProdWater
        first3MonthProdOil
        first3MonthProdGas
        first3MonthProdWater
        first6MonthProdOil
        first6MonthProdGas
        first6MonthProdWater
        first12MonthProdOil
        first12MonthProdGas
        first12MonthProdWater
        lastMonthProdOil
        lastMonthProdGas
        lastMonthProdWater
        last6MonthProdOil
        last6MonthProdGas
        last6MonthProdWater
        last12MonthProdOil
        last12MonthProdGas
        last12MonthProdWater
    }
  }`
  return useLazyQuery(PRODRANGEQUERY);
}