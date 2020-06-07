import React from 'react';
import gql from "graphql-tag";


  export const WELLSQUERY = gql`query getWells($wellIdArray:[String],$authToken:String) {
        wells(wellIdArray:$wellIdArray,authToken:$authToken) {
          success
          message
          results {
            id
            wellName
            api
            operator
            wellType
            latitude
            longitude
            wellBoreProfile
            ownerCount
            isTracked
          }   
        }
  }`