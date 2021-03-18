import React, { useState, useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import {TOPOPERATORS} from "../../../graphQL/useQueryTopOperators";
import { useLazyQuery } from "@apollo/client";


export default function OperatorFilterJ() {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [operatorName, setOperatorName] = React.useState(stateNav.operatorName ? stateNav.operatorName : []);
  const [operatorList, setOperatorsList] = useState([]);
  const [getOperators, { data: topOperatorData }] = useLazyQuery(TOPOPERATORS);

  useEffect(() => {
    // use effect is querying the top operator data 
    // top operator data is used for the autocomplete filter 
    
    getOperators();
  }, []);

  useEffect(() => {
    // this use effect is taking the top operator data response 
    // reformatting into an array 
    // and setting the operator list for the filter 

    if (topOperatorData) {
      const operatorList = topOperatorData.topOperators.map((item) => item.CurrentOperator);
      setOperatorsList(operatorList);
    } else {
      setOperatorsList([]);
      setStateNav((stateNav) => ({
        ...stateNav,
        operatorName: null,
      }));
     }   
  }, [topOperatorData]);



  const handleOperatorChange = (value) => {
    let filter;
    if (value && value.length) {
      filter = ["match", ["get", "operator"], value, true, false];
      setStateNav((stateNav) => ({ ...stateNav, operatorName: value }));
      setOperatorName(value);
    } else {
      filter = null;
      setStateNav((stateNav) => ({ ...stateNav, operatorName: [] }));
    }
    setStateNav((stateNav) => ({ ...stateNav, filterOperator: filter }));
  };

  return (
    <Autocomplete
      defaultValue={stateNav.operatorName ? stateNav.operatorName : []}
      onChange={(event, newValue) => {
        handleOperatorChange(newValue);
      }}
      multiple
      options={operatorList}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Operator"
          placeholder=""
          fullWidth
        />
      )}
      disableListWrap
      id="virtualize-operators"
    />
  );
}
