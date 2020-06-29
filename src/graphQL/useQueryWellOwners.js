import React from 'react';
import gql from "graphql-tag";

export const WELLOWNERSQUERY = gql`query getWellOwners($id:String) {
  wellOwners(wellId:$id) {
      id
      name
      ownershipType
      interestType
      ownershipPercentage
      appraisedValue
      isTracked  
  }
}`

/* export default function useQueryWellOwners(id) {
 
  const WELLOWNERSQUERY = gql`query {
    wellOwners (wellId:"${id}") {
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