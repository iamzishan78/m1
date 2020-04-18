import React, { useState, createContext } from 'react'
const WellCardContext = createContext([{}, () => {}])

const chartData = JSON.parse("{\"API\":\"fd5037d0-9802-4790-ba07-b0206ec36801\",\"StartDate\":\"2016-12-01T00:00:00\",\"EndDate\":\"2019-02-01T00:00:00\",\"Data\":[{\"Year\":2016,\"Month\":12,\"ReportDate\":\"2016-12-01T00:00:00\",\"Gas\":0.0,\"Oil\":91.0,\"Water\":0.0},{\"Year\":2017,\"Month\":1,\"ReportDate\":\"2017-01-01T00:00:00\",\"Gas\":0.0,\"Oil\":69.0,\"Water\":0.0},{\"Year\":2017,\"Month\":3,\"ReportDate\":\"2017-03-01T00:00:00\",\"Gas\":0.0,\"Oil\":61.0,\"Water\":0.0},{\"Year\":2017,\"Month\":4,\"ReportDate\":\"2017-04-01T00:00:00\",\"Gas\":0.0,\"Oil\":65.0,\"Water\":0.0},{\"Year\":2017,\"Month\":5,\"ReportDate\":\"2017-05-01T00:00:00\",\"Gas\":0.0,\"Oil\":21.0,\"Water\":0.0},{\"Year\":2017,\"Month\":7,\"ReportDate\":\"2017-07-01T00:00:00\",\"Gas\":0.0,\"Oil\":80.0,\"Water\":0.0},{\"Year\":2017,\"Month\":8,\"ReportDate\":\"2017-08-01T00:00:00\",\"Gas\":0.0,\"Oil\":70.0,\"Water\":0.0},{\"Year\":2017,\"Month\":11,\"ReportDate\":\"2017-11-01T00:00:00\",\"Gas\":0.0,\"Oil\":46.0,\"Water\":0.0},{\"Year\":2017,\"Month\":12,\"ReportDate\":\"2017-12-01T00:00:00\",\"Gas\":0.0,\"Oil\":82.0,\"Water\":0.0},{\"Year\":2018,\"Month\":1,\"ReportDate\":\"2018-01-01T00:00:00\",\"Gas\":0.0,\"Oil\":66.0,\"Water\":0.0},{\"Year\":2018,\"Month\":4,\"ReportDate\":\"2018-04-01T00:00:00\",\"Gas\":0.0,\"Oil\":45.0,\"Water\":0.0},{\"Year\":2018,\"Month\":5,\"ReportDate\":\"2018-05-01T00:00:00\",\"Gas\":0.0,\"Oil\":43.0,\"Water\":0.0},{\"Year\":2018,\"Month\":7,\"ReportDate\":\"2018-07-01T00:00:00\",\"Gas\":0.0,\"Oil\":50.0,\"Water\":0.0},{\"Year\":2018,\"Month\":8,\"ReportDate\":\"2018-08-01T00:00:00\",\"Gas\":0.0,\"Oil\":29.0,\"Water\":0.0},{\"Year\":2018,\"Month\":9,\"ReportDate\":\"2018-09-01T00:00:00\",\"Gas\":0.0,\"Oil\":50.0,\"Water\":0.0},{\"Year\":2018,\"Month\":10,\"ReportDate\":\"2018-10-01T00:00:00\",\"Gas\":0.0,\"Oil\":46.0,\"Water\":0.0},{\"Year\":2018,\"Month\":11,\"ReportDate\":\"2018-11-01T00:00:00\",\"Gas\":0.0,\"Oil\":15.0,\"Water\":0.0},{\"Year\":2019,\"Month\":2,\"ReportDate\":\"2019-02-01T00:00:00\",\"Gas\":0.0,\"Oil\":79.0,\"Water\":0.0}]}")
//console.log('chart',chartData)

const WellCardContextProvider = props => {
  const [stateWellCard, setStateWellCard] = useState({
    selectedWell: { WellName: '' },
    openWellDetails: false,
    chartData:chartData,
    chartToggleOil: true, 
    chartToggleGas: true, 
    chartToggleWater: true, 
    chartToggleMultiAxis: false, 

  })
  return (
    <WellCardContext.Provider value={[stateWellCard, setStateWellCard]}>
      {props.children}
    </WellCardContext.Provider>
  )
}

export { WellCardContext, WellCardContextProvider }
