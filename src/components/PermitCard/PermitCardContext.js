import React, { useState, createContext } from 'react'
const PermitCardContext = createContext([{}, () => {}])

const PermitCardContextProvider = React.memo((props) => {
  const [statePermitCard, setStateWellCard] = useState({
    selectedPermit: { permitName: '' },
    openPermitDetails: false,
    chartData:chartData,
    chartToggleOil: true, 
    chartToggleGas: true, 
    chartToggleWater: true, 
    chartToggleMultiAxis: false, 

  })
  return (
    <PermitCardContext.Provider value={[stateWellCard, setStateWellCard]}>
      {props.children}
    </PermitCardContext.Provider>
  )
})

PermitCardContext.whyDidYouRender = true
PermitCardContextProvider.whyDidYouRender = true
export { PermitCardContext, PermitCardContextProvider }
