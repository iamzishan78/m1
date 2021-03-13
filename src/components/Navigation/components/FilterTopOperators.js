import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { NavigationContext } from "../NavigationContext";
import useQueryTopOperators from "../../../graphQL/useQueryTopOperators";



export default function OperatorsFilter() {

const [stateNav, setStateNav] = useContext(NavigationContext);
const [operatorName, setOperatorName] = React.useState(
  stateNav.operatorName ? stateNav.operatorName : []
);
const [OperatorList, setOperatorsList] = useState([]);
const [getOperators, { loading, data }] = useQueryTopOperators();



  useEffect(() => {
    getOperators();
  }, []);

  useEffect(() => {
    if (data) {
      setOperatorsList(data.operatorName);
    } else {
      setOperatorsList([]);
      setStateNav((stateNav) => ({
        ...stateNav,
        operatorName: null,
      }));
     }   
  }, []);

  // useEffect(() => {
  //   const operators =
  //   data && data.operatorName
  //     ? data.operatorName
  //     : [];
  //   let list = [];
  //   operators.forEach((value) => { 
  //       list.push(value)
  //   })
  //   let sortedList = []
  //   list.map(operatorName => 
  //     sortedList.push(operatorName.operatorName)
  //   )
  //   setOperatorsList(sortedList)
 
  // }, [data, loading, getOperators, stateNav.operatorName]);

  // useEffect(()=> {
  //   if( operatorName != null && operatorName.length > 0){
  //     setStateNav(stateNav => ({ ...stateNav, operatorName: operatorName}));
  //   } 
  // },[setStateNav, stateNav.operatorName, operatorName]) 


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
    //defaultValue={stateNav.operatorName ? stateNav.operatorName : []}
    value={OperatorList.length === 0 ? "" : stateNav.operatorName}  
    onChange={(event, newValue) => {
        handleOperatorChange(newValue);
      }}
      multiple
      options={OperatorList}
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
      //style={{ maxWidth: 300, minWidth: 120 }}
    />
  );
}