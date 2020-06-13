import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavigationContext } from "../NavigationContext";
import FilterTags from "./FilterTags";
import FilterTrackedWells from "./FilterTrackedWells";
import Grid from "@material-ui/core/Grid";
import { WELLSMINMAXLATLONGFROMIDSARRAY } from "../../../graphQL/useQueryWellsMinMaxLatLongFromIdsArray";
import { useLazyQuery } from "@apollo/react-hooks";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function FilterFormProduction() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [, setStateApp] = useContext(AppContext);
  const [getWellsMinMaxLatLongFromIdsArray, { data }] = useLazyQuery(
    WELLSMINMAXLATLONGFROMIDSARRAY
  );

  useEffect(() => {
    let filter;

    if (stateNav.wellsIdsFromTags && stateNav.wellsIdsFromTags.length > 0) {
      let IdsArray = [];
      for (let i = 0; i < stateNav.wellsIdsFromTags.length; i++) {
        if (IdsArray.indexOf(stateNav.wellsIdsFromTags[i]) === -1)
          IdsArray.push(stateNav.wellsIdsFromTags[i]);
      }

      filter = ["match", ["get", "id"], IdsArray, true, false];

      getWellsMinMaxLatLongFromIdsArray({
        variables: {
          idsArray: IdsArray,
        },
      });
    } else {
      filter = null;
    }

    setStateNav((stateNav) => ({ ...stateNav, filterTags: filter }));
  }, [stateNav.wellsIdsFromTags]);

  useEffect(() => {
    if (data) {
      if (
        data.wellsMinMaxLatLongFromIdsArray &&
        data.wellsMinMaxLatLongFromIdsArray.length > 0 &&
        data.wellsMinMaxLatLongFromIdsArray[0].maxLat &&
        data.wellsMinMaxLatLongFromIdsArray[0].minLat &&
        data.wellsMinMaxLatLongFromIdsArray[0].maxLong &&
        data.wellsMinMaxLatLongFromIdsArray[0].minLong
      ) {
        ///////////Setting Filters Bounds////////
        setStateApp((stateApp) => ({
          ...stateApp,
          fitBounds: data.wellsMinMaxLatLongFromIdsArray[0],
        }));
      } else {
        setStateApp((stateApp) => ({
          ...stateApp,
          fitBounds: null,
        }));
      }
    }
  }, [data]);

  return (
    <Grid
      container
      item
      spacing={2}
      style={{ padding: "8px", width: "100%", margin: "0" }}
    >
      <Grid item sm={12} className={classes.gridItem}>
        <FilterTags />
      </Grid>
      <Grid item sm={12} className={classes.gridItem}>
        <FilterTrackedWells />
      </Grid>
    </Grid>
  );
}
