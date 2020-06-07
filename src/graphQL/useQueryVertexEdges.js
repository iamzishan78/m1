import React from 'react';
import gql from "graphql-tag";


  export const VERTEXEDGESQUERY = gql`query getVertexEdges($source:VertexInput,$edgeLabel:String,$targetLabel:String) {
    vertexEdges(source:$source,edgeLabel:$edgeLabel,targetLabel:$targetLabel){
        success
        message
        sourceIds
    }
  }`

