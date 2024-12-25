import gql from 'graphql-tag';
import React from 'react';

export const PRODUCTIONDETAILQUERY = gql`
	query getExternalProductionDetail($id: String, $pageSize: String) {
		externalProductionDetail(wellId: $id, pageSize: $pageSize)
	}
`;
