import React from 'react';
import {QuadContextProvider} from './QuadContext';

import QuadSummary from './QuadSummary';




function QuadProvider(props) {
  
       
  return (
   
    <QuadContextProvider>
    
          <QuadSummary/>
    
     </QuadContextProvider>
 
  
  );
  
}

export default QuadProvider;