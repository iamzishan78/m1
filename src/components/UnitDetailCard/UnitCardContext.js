import React, { useState, createContext } from 'react'

const UnitCardContext = createContext([{}, () => { }])

const UnitCardContextProvider = props => {
  const [stateCard, setStateCard] = useState({
    selectedUnit: { shapeLabel: '' },
    selectedUnitGeom: null,
  })
  return (
    <UnitCardContext.Provider value={[stateCard, setStateCard]}>
      {props.children}
    </UnitCardContext.Provider>
  )
}

export { UnitCardContext, UnitCardContextProvider }
