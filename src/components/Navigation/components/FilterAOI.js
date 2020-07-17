import React, { useContext, useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import { AppContext } from "../../../AppContext";

export default () => {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [aoiData, setAOIData] = useState([]);
  const [aoiName, setAOIName] = useState(
    stateNav.aoiName ? stateNav.aoiName : []
  );
  const [aoiNameList, setAOINameList] = useState([]);

  useEffect(() => {
    const groupBy = (arr, property) => {
      return arr.reduce((memo, x) => {
        if (!memo[x[property]]) {
          memo[x[property]] = [];
        }
        memo[x[property]].push(x);
        return memo;
      }, {});
    };

    const layerData = groupBy(stateApp.customLayers, "layer")['interest'];
    if (layerData && layerData.length > 0) {
      setAOIData(layerData);
      setAOINameList(layerData.filter(layer => layer.name).map(layer => layer.name));
    }    
  }, [stateApp.customLayers]);

  const handleAOIChange = (value) => {
    let filter;
    if (value && value.length) {
      const layers = aoiData.filter(aoi => value.indexOf(aoi.name) > -1);
      filter = layers.map(basinShape => {
        return JSON.parse(basinShape.shape);
      });
      console.log(layers, filter);
      setStateNav((stateNav) => ({ ...stateNav, aoiName: value }));
      setAOIName(value);
    } else {
      filter = null;
      setStateNav((stateNav) => ({ ...stateNav, aoiName: null }));
    }
    setStateNav((stateNav) => ({ ...stateNav, filterAOI: filter }));
  };

  if (aoiNameList.length > 0) {
    return (
      <Autocomplete
        defaultValue={aoiName}
        onChange={(event, newValue) => {
          handleAOIChange(newValue);
        }}
        multiple
        ChipProps={{ color: "secondary" }}
        options={aoiNameList}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Area of Interest"
            placeholder=""
            fullWidth
          />
        )}
        disableListWrap
        id="virtualize-aoi"
      />
    );
  }

  return null;
}
