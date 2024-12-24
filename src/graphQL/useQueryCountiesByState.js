import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';

export default function useQueryCountiesByState(state) {
	const CountiesByStateQUERY = gql`query {
    counties(state:"${state}") {
      county
      state
    }
  }`;

	return useLazyQuery(CountiesByStateQUERY);
}
