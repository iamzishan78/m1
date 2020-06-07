import React from 'react'
import { OwnersContextProvider } from './OwnersContext'

import OwnerTable from './OwnerTable'


export default function OwnersProvider(props) {
  

  return (
    <OwnersContextProvider>
     
        <OwnerTable selectedWell={props.selectedWell} parent={props.parent}/>
     
    </OwnersContextProvider>
  )
}