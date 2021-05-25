import React from 'react';
import gql from "graphql-tag";

export const PERMITDETAILQUERY = gql`query sqlQueryRecentSubmittedPermits($id:String) {
    recent_submitted_permits(permit_id:$id)
}`
