import React from 'react';
import gql from "graphql-tag";
  export const LOGINQUERY = gql`query {
    login(userName:${userName},password:${password}) {
      success
      message
      user {
        id
        email
        name
        authToken
        authTokenExpires
        authRefreshTokem
      }
      
    }
  }`

