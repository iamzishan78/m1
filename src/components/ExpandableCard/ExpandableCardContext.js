import React, { useState, createContext } from 'react'
const ExpandableCardContext = createContext([{}, () => {}])

const ExpandableCardContextProvider = props => {
  const [stateExpandableCard, setStateExpandableCard] = useState({
    expanded:false
  })
  return (
    <ExpandableCardContext.Provider value={[stateExpandableCard, setStateExpandableCard]}>
      {props.children}
    </ExpandableCardContext.Provider>
  )
}

export { ExpandableCardContext, ExpandableCardContextProvider }
