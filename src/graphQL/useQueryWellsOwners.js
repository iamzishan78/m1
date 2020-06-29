import React from 'react';
import gql from "graphql-tag";

export const WELLSOWNERSQUERY = gql`query getWellsOwners($api:[String]) {
  wellsOwners(wellIdArray:$api)
}`

/* export default function useQueryWellOwners(api) {
 
  const WELLOWNERSQUERY = gql`query {
    wellOwners (wellId:"${api}") {
      id
      name
      ownerType
      ownershipType
      ownershipPercentage
      appraisedValue
      isTracked
    
    
    }
  }`
      const { data,loading, error} = useQuery(WELLOWNERSQUERY);
    
      return {data,loading,error}

} */