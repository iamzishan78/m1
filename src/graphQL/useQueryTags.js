import React from 'react';
import gql from "graphql-tag";


  export const TAGSQUERY = gql`query getTags($tagIdArray:[ID]) {
        tags(tagIdArray:$tagIdArray) {
          success
          message
          results {
            id
            tag
          }   
        }
  }`