import React from 'react';
import gql from "graphql-tag";


  export const USERTAGSQUERY = gql`query getUserTags($userId:ID) {
        userTags(userId:$userId)
  }`