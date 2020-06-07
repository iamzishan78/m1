import React, { useState, createContext } from 'react'

const StudioContext = createContext([{}, () => {}])

const StudioContextProvider = props => {
  const [stateStudio, setStateStudio] = useState({
    selectedWell: { WellName: '' }
  })
  return (
    <StudioContext.Provider value={[stateStudio, setStateStudio]}>
      {props.children}
    </StudioContext.Provider>
  )
}

export { StudioContext, StudioContextProvider }
