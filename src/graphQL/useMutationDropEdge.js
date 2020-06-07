import React from 'react';
import gql from "graphql-tag";

/* *************************
EXAMPLE
source: {
  SourceId:"6cdb835f-cb0e-434d-9269-9e6b81e8bc26",
label:"tenant"
 name:"M1neral"
type:"vertex"
properties:[{key:"other",value:"other tenant prop"}] 
},
target: {
SourceId:"6a5fb549-3987-403f-8852-0c693520110e",
label:"user"
name:"Camilo Pineda"
type:"vertex"
properties:[{key:"other",value:"other user prop"}]
},relationshipLabel:"granted access to")

************************* */


  export const DROPEDGEQUERY = gql`mutation dropGraphEdge($source:VertexInput,$target:VertexInput,$relationshipLabel:String){
    dropEdge(source:$source,target:$target,relationshipLabel:$relationshipLabel) {
          success
          message
        }
      
  }`

