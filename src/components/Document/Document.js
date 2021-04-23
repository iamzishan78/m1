
import React from "react";
import { AppContext } from "../../AppContext";
import M1nTable from '../Shared/M1nTable/M1nTable'
import Drawer from './components/Drawer'



export default function Document() {
 
  return(
    <div>
      <M1nTable dense parent="Documents" ></M1nTable>
      <Drawer data={true}></Drawer>
    </div>
  )

}
