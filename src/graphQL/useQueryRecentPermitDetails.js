import React from 'react';
import gql from "graphql-tag";

export const PERMITDETAILQUERY = gql`query getRecentPermitDetail($id:String) {
    recentPermitDetail(permitId:$id)
}`
