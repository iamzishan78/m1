import React, { useState, useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
// import { TOPOPERATORS } from "../../../graphQL/useQueryTopOperators";
import { useLazyQuery } from "@apollo/client";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";

export default function OperatorFilterJ() {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [operatorName, setOperatorName] = React.useState(stateNav.operatorName);
  const [operatorList, setOperatorsList] = useState([]);
  // const [getOperators, { data: topOperatorData }] = useLazyQuery(TOPOPERATORS);

  const [getESPaginatedList, { data: esOperatorsData }] = useLazyQuery(GET_ES_PAGINATED_LIST, { fetchPolicy: "no-cache" });

  useEffect(() => {
    // use effect is querying the top operator data
    // top operator data is used for the autocomplete filter
    getESPaginatedList({
      variables: {
        esIndex: "platformData:operator",
        sort: [],
        pagination: {
          first: 1,
          keep_alive: "1micros"
        },
      }
    });
    // getOperators();
  }, []);

  useEffect(() => {
    // this use effect is taking the top operator data response
    // reformatting into an array
    // and setting the operator list for the filter

    if (esOperatorsData) {
      const operatorList = esOperatorsData.getESPaginatedList?.hits?.map((item) => item.operator);

      setOperatorsList(operatorList);
    } else {
      setOperatorsList([]);
    }
  }, [esOperatorsData]);

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
      ChipProps={{ color: "secondary" }}
      defaultValue={stateNav.operatorName}
      value={stateNav.operatorName}
      onChange={(event, newValue) => {
        handleOperatorChange(newValue);
      }}
      multiple
      options={operatorList}
      renderInput={(params) => <TextField {...params} variant="outlined" label="Operator" placeholder="" fullWidth />}
      disableListWrap
      id="virtualize-operators"
    />
  );
}
