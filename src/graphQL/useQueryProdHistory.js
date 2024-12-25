import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';

export default function useQueryProdHistory(id) {
	const WELLPRODHISTORYQUERY = gql`query {
    wellProdHistory(wellId:"${id}") {
            year
            month
            reportDate
            gas
            oil
            water
    }
  }`;
	const { data, loading, error } = useQuery(WELLPRODHISTORYQUERY);

	return { data, loading, error };
}
