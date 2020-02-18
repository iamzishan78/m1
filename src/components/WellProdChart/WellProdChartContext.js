import React,{ useState,createContext } from 'react'


  const WellProdChartContext = createContext([{}, () => {}]);

const WellProdChartContextProvider = (props) => {
    const [stateWellProdChart, setStateWellProdChart] = useState({
        chart:null,
        selectedRange:12,
        quadChart:null,
        wellProdHistory:null
      });
    return (
      <WellProdChartContext.Provider value={[stateWellProdChart, setStateWellProdChart]}>
        {props.children}
      </WellProdChartContext.Provider>
    );
  };

export { WellProdChartContext, WellProdChartContextProvider };