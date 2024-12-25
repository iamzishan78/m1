import gql from 'graphql-tag';
import React from 'react';

export const WELLSUMMARYDETAILQUERY = gql`
	query getWellSummaryDetail($id: String) {
		wellSummaryDetail(wellId: $id)
	}
`;
