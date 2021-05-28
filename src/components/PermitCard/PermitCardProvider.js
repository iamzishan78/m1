import React from 'react'
import { PermitCardContextProvider } from './PermitCardContext'

import PermitCard from './PermitCard'


function PermitCardProvider(props) {
  const handleClosePermitCard = () => {
    props.closePermitCard()
  }

  return (
    <PermitCardContextProvider>
     
        <PermitCard
          closePermitCard={handleClosePermitCard}
          selectedPermit={props.selectedPermit}
        />
     
    </PermitCardContextProvider>
  )
}

PermitCardProvider.whyDidYouRender = true
export default React.memo(PermitCardProvider);
