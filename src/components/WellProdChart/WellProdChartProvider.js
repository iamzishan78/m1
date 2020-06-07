import React from 'react';
import {WellProdChartContextProvider} from './WellProdChartContext';

import WellProdChart from './WellProdChart';




function WellProdChartProvider(props) {
  
       
  return (
   
    <WellProdChartContextProvider>
    
          <WellProdChart/>
    
     </WellProdChartContextProvider>
 
  
  );
  
}

export default WellProdChartProvider;