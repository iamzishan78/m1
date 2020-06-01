import React from 'react';
import gql from "graphql-tag";

export const WELLSUMMARYDETAILQUERY = gql`query getWellSummaryDetail($api:String) {
  wellSummaryDetail(wellId:$api)
}`
