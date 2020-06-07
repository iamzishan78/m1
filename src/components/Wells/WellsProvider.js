import React from 'react'
import { WellsContextProvider } from './WellsContext'

import WellTable from './WellTable'


export default function WellsProvider(props) {
  

  return (
    <WellsContextProvider>
     
        <WellTable showList={props.showList} parent={props.parent}/>
     
    </WellsContextProvider>
  )
}