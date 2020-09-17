import React, { useState, createContext } from 'react'

const ParcelCardContext = createContext([{}, () => {}])

const ParcelCardContextProvider = props => {
  const [stateCard, setStateCard] = useState({
    selectedParcel: { shapeLabel: '' },
  })
  return (
    <ParcelCardContext.Provider value={[stateCard, setStateCard]}>
      {props.children}
    </ParcelCardContext.Provider>
  )
}

export { ParcelCardContext, ParcelCardContextProvider }
