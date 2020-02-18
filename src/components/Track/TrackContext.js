import React, { useState, createContext } from 'react'

const TrackContext = createContext([{}, () => {}])

const TrackContextProvider = props => {
  const [stateTrack, setStateTrack] = useState({
    selectedWell: { WellName: '' }
  })
  return (
    <TrackContext.Provider value={[stateTrack, setStateTrack]}>
      {props.children}
    </TrackContext.Provider>
  )
}

export { TrackContext, TrackContextProvider }
