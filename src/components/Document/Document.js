
import React from "react";
import { AppContext } from "../../AppContext";
import M1nTable from '../Shared/M1nTable/M1nTable'




export default function Document() {
  const [stateApp, setStateApp] = React.useContext(AppContext);
   console.log(stateApp, 'StateApp Documents')
  return(
    <div>
      {/* <h1>Facebook</h1> */}
      <M1nTable dense parent="Documents" ></M1nTable>
    </div>
  )

}
