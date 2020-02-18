import React,{ useState,createContext } from 'react'


  const QuadContext = createContext([{}, () => {}]);

let sampleQuadData = [
  {
    quadrant:1,
    metric:'Oil',
    units:'bbl',
    value12:556,
    value36:556*3,
    value48:556*4
  },
  {
    quadrant:2,
    metric:'Gas',
    units:'mcf',
    value12:1436,
    value36:1436*3,
    value48:1436*4
  },
  {
    quadrant:3,
    metric:'H2O',
    units:'bbl',
    value12:328,
    value36:328*3,
    value48:328*4
  },
  {
    quadrant:4,
    metric:'BOE', 
    units:'boe',
    value12:'983K',
    value36:'2.95M',
    value48:'3.93M'
  }
]
const QuadContextProvider = (props) => {
    const [stateQuad, setStateQuad] = useState({
        metrics:sampleQuadData,
        selectedRange:0,
        quadChart:null
      });
    return (
      <QuadContext.Provider value={[stateQuad, setStateQuad]}>
        {props.children}
      </QuadContext.Provider>
    );
  };

export { QuadContext, QuadContextProvider };