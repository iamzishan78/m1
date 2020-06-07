import React from 'react'
import { WellCardContextProvider } from './WellCardContext'

import WellCard from './WellCard'


export default function WellCardProvider(props) {
  const handleCloseWellCard = () => {
    props.closeWellCard()
  }

  return (
    <WellCardContextProvider>
     
        <WellCard
          closeWellCard={handleCloseWellCard}
          selectedWell={props.selectedWell}
        />
     
    </WellCardContextProvider>
  )
}


