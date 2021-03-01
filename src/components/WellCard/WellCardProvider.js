import React from 'react'
import { WellCardContextProvider } from './WellCardContext'

import WellCard from './WellCard'


function WellCardProvider(props) {
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

WellCardProvider.whyDidYouRender = true
export default React.memo(WellCardProvider);