import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import { BASINNAMESQUERY } from "../../../graphQL/useQueryBasinNames";
import { GETBASINSHAPES } from "../../../graphQL/useQueryBasinShapes";
import { findBoundsMap } from "components/MapControls/commonHelper";
import { layerController } from "hookstate/layerStateController";

export default function BasinFilterJ() {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [basinName, setBasinName] = React.useState(stateNav.basinName ? stateNav.basinName : []);
  const [basinNameList, setBasinNameList] = useState([]);
  const [getBasinNames, { data: basinList }] = useLazyQuery(BASINNAMESQUERY);
  const [getBasinShapes, { data: basinShapes }] = useLazyQuery(GETBASINSHAPES);

  useEffect(() => {
    if (!stateNav.filterBasin?.length && basinName.length) {
      setBasinName([]);
      window?.mapRef?.setFilter("basinLayer", null);
      window?.mapRef?.setFilter("basinLabels", null);
    } else {
      window?.mapRef?.setFilter("basinLayer", ["match", ["get", "NAME"], basinName, true, false]);
      window?.mapRef?.setFilter("basinLabels", ["match", ["get", "NAME"], basinName, true, false]);
    }
  }, [stateNav.filterBasin]);

  useEffect(() => {
    getBasinNames();
  }, [getBasinNames]);

  useEffect(() => {
    if (basinList && basinList.basinNames) {
      setBasinNameList(basinList.basinNames.map((basinName) => basinName.name).sort());
    }
  }, [basinList]);

  useEffect(() => {
    if (basinShapes && basinShapes.basinShapes) {
      const filter = basinShapes.basinShapes.map((basinShape) => {
        return JSON.parse(basinShape.shape);
      });

      findBoundsMap(filter, window.mapRef, {
        top: 300, bottom: 300, left: 300, right: 300
      });

      setStateNav((stateNav) => ({ ...stateNav, filterBasin: filter }));
    }
  }, [basinShapes]);

  const handleBasinChange = (value) => {
    let filter;

    if (value && value.length) {
      getBasinShapes({
        variables: {
          names: value,
        },
      });

      layerController.toggleLayersActivity("Basins", true);
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
      value={basinName}
      onChange={(event, newValue) => {
        handleBasinChange(newValue);
      }}
      multiple
      ChipProps={{ color: "secondary" }}
      options={basinNameList}
      renderInput={(params) => <TextField {...params} variant="outlined" label="Basin" placeholder="" fullWidth />}
      disableListWrap
      id="virtualize-basins"
    />
  );
}
