import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import { BASINNAMESQUERY } from "../../../graphQL/useQueryBasinNames";
import { GETBASINSHAPES } from '../../../graphQL/useQueryBasinShapes';

export default function BasinFilterJ() {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [basinName, setBasinName] = React.useState(
    stateNav.basinName ? stateNav.basinName : []
  );
  const [basinNameList, setBasinNameList] = useState([]);

  const [getBasinNames, { data: basinList }] = useLazyQuery(
    BASINNAMESQUERY
  );

  const [getBasinShapes, { data: basinShapes }] = useLazyQuery(
    GETBASINSHAPES
  );

  useEffect(() => {
    getBasinNames();
  }, [getBasinNames]);

  useEffect(() => {
    if (basinList && basinList.basinNames) {
      setBasinNameList(basinList.basinNames.map(basinName => basinName.name));
    }
  }, [basinList])

  useEffect(() => {
    if (basinShapes && basinShapes.basinShapes) {
      const filter = basinShapes.basinShapes.map(basinShape => {
        return JSON.parse(basinShape.shape);
      });
      console.log(filter);
      setStateNav((stateNav) => ({ ...stateNav, filterBasin: filter }));
    }
  }, [basinShapes])

  const handleBasinChange = (value) => {
    let filter;
    if (value && value.length) {
      getBasinShapes({
        variables: {
          names: value
        }
      });
      // filter = ["match", ["get", "basin"], value, true, false];
      setStateNav((stateNav) => ({ ...stateNav, basinName: value }));
      setBasinName(value);
    } else {
      filter = null;
      setStateNav((stateNav) => ({ ...stateNav, basinName: null }));
      setStateNav((stateNav) => ({ ...stateNav, filterBasin: filter }));
    }
    // setStateNav((stateNav) => ({ ...stateNav, filterBasin: filter }));
  };

  return (
    <Autocomplete
      defaultValue={basinName}
      onChange={(event, newValue) => {
        handleBasinChange(newValue);
      }}
      multiple
      ChipProps={{ color: "secondary" }}
      options={basinNameList}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Basin"
          placeholder=""
          fullWidth
        />
      )}
      disableListWrap
      id="virtualize-basins"
    />
  );
}
