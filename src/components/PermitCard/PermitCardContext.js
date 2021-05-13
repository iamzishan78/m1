import React, { useState, createContext } from 'react'
const PermitCardContext = createContext([{}, () => {}])

const PermitCardContextProvider = React.memo((props) => {
  const [statePermitCard, setStatePermitCard] = useState({
    selectedPermit: { permitName: '' },
    openPermitDetails: false,
    chartToggleOil: true, 
    chartToggleGas: true, 
    chartToggleWater: true, 
    chartToggleMultiAxis: false, 

  })
  return (
    <PermitCardContext.Provider value={[statePermitCard, setStatePermitCard]}>
      {props.children}
    </PermitCardContext.Provider>
  )
})

PermitCardContext.whyDidYouRender = true
PermitCardContextProvider.whyDidYouRender = true
export { PermitCardContext, PermitCardContextProvider }
