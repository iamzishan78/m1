import React from "react";
import { DetailComponents } from "./DetailsComponent";
import { DrawerContextProvider } from "./DrawerContext";


export default function DetailsComponentContainer(){
  return (
    <DrawerContextProvider>
      <DetailComponents />
    </DrawerContextProvider>
  )
}