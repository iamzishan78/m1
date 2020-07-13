import React, { useContext, useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import { AppContext } from "../../../AppContext";

export default () => {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [parcelData, setParcelData] = useState([]);
  const [parcelName, setParcelName] = useState(
    stateNav.parcelName ? stateNav.parcelName : []
  );
  const [parcelNameList, setParcelNameList] = useState([]);

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

    const layerData = groupBy(stateApp.customLayers, "layer")['parcel'];
    if (layerData && layerData.length > 0) {
      setParcelData(layerData);
      setParcelNameList(layerData.filter(layer => layer.name).map(layer => layer.name));
    }
    
  }, [stateApp.customLayers]);

  const handleParcelChange = (value) => {
    let filter;
    if (value && value.length) {
      const layers = parcelData.filter(parcel => value.indexOf(parcel.name) > -1);
      filter = layers.map(basinShape => {
        return JSON.parse(basinShape.shape);
      });
      console.log(layers, filter);
      setStateNav((stateNav) => ({ ...stateNav, parcelName: value }));
      setParcelName(value);
    } else {
      filter = null;
      setStateNav((stateNav) => ({ ...stateNav, parcelName: null }));
    }
    setStateNav((stateNav) => ({ ...stateNav, filterParcel: filter }));
  };

  if (parcelNameList.length > 0) {
    return (
      <Autocomplete
        defaultValue={parcelName}
        onChange={(event, newValue) => {
          handleParcelChange(newValue);
        }}
        multiple
        ChipProps={{ color: "secondary" }}
        options={parcelNameList}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Parcel"
            placeholder=""
            fullWidth
          />
        )}
        disableListWrap
        id="virtualize-parcel"
      />
    );
  }
  return null;
}
