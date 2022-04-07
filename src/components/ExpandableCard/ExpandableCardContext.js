import React, { useState, createContext } from 'react'
const ExpandableCardContext = createContext([{}, () => { }])

const ExpandableCardContextProvider = React.memo((props) => {
  const [stateExpandableCard, setStateExpandableCard] = useState({
    expanded: false
  })
  const handleCloseExpandableCard = () => {
    props.handleCloseExpandableCard();
  }

  return (
    <ExpandableCardContext.Provider value={[stateExpandableCard, setStateExpandableCard, handleCloseExpandableCard]}>
      {props.children}
    </ExpandableCardContext.Provider>
  )
});

ExpandableCardContext.whyDidYouRender = true
ExpandableCardContextProvider.whyDidYouRender = true
export { ExpandableCardContext, ExpandableCardContextProvider }
