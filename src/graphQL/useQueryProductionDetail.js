import React from 'react';
import gql from "graphql-tag";

export const PRODUCTIONDETAILQUERY = gql`query getExternalProductionDetail($id:String, $pageSize:String) {
    externalProductionDetail(wellId:$id, pageSize:$pageSize)
}`