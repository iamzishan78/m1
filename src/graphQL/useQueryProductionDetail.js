import React from 'react';
import gql from "graphql-tag";

export const PRODUCTIONDETAILQUERY = gql`query getProductionDetail($id:String) {
    productionDetail(wellId:$id)
}`
