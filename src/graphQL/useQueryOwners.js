import React from 'react';
import gql from "graphql-tag";


  export const OWNERSQUERY = gql`query getOwners($ownerIdArray:[String],$authToken:String) {
        owners(ownerIdArray:$ownerIdArray,authToken:$authToken) {
          success
          message
          results {
            id
            name
            ownerType
            ownershipType
            interestType
            ownershipPercentage
            appraisedValue
            isTracked
          }   
        }
  }`

