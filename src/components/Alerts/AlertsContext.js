import React, { useState, createContext } from 'react'

const AlertsContext = createContext([{}, () => {}])

const AlertsContextProvider = props => {
  const [stateAlerts, setStateAlerts] = useState({
    selectedWell: { WellName: '' }
  })
  return (
    <AlertsContext.Provider value={[stateAlerts, setStateAlerts]}>
      {props.children}
    </AlertsContext.Provider>
  )
}

export { AlertsContext, AlertsContextProvider }
