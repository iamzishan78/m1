import React from 'react'
import { WellCardContextProvider } from './WellCardContext'

import WellCard from './WellCard'

function WellCardProvider(props) {

  return (
    <WellCardContextProvider>
      <WellCard
        selectedWell={props.selectedWell}
      />
    </WellCardContextProvider>
  )
}

WellCardProvider.whyDidYouRender = true
export default React.memo(WellCardProvider);