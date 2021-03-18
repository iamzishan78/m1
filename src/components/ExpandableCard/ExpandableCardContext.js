import React, { useState, createContext } from 'react'
const ExpandableCardContext = createContext([{}, () => {}])

const ExpandableCardContextProvider = React.memo((props) => {
  const [stateExpandableCard, setStateExpandableCard] = useState({
    expanded:false
  })
  return (
    <ExpandableCardContext.Provider value={[stateExpandableCard, setStateExpandableCard]}>
      {props.children}
    </ExpandableCardContext.Provider>
  )
})

ExpandableCardContext.whyDidYouRender = true
ExpandableCardContextProvider.whyDidYouRender = true
export { ExpandableCardContext, ExpandableCardContextProvider }
