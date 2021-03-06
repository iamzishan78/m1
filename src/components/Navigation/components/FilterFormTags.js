import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavigationContext } from "../NavigationContext";
import FilterTags from "./FilterTags";
import FilterTrackedOwners from "./FilterTrackedOwners";
import FilterTrackedWells from "./FilterTrackedWells";
import Grid from "@material-ui/core/Grid";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AppContext } from "../../../AppContext";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
// import { UPDATELAYERSETTINGS } from "../../../graphQL/useMutationUpdateLayerSettings";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function FilterFormProduction() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateApp, setStateApp] = useContext(AppContext);

  // const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    let filter = null;
    if (stateNav.wellsIdsFromTags) {
      let IdsArray = [];
      for (let i = 0; i < stateNav.wellsIdsFromTags.length; i++) {
        if (IdsArray.indexOf(stateNav.wellsIdsFromTags[i]) === -1)
          IdsArray.push(stateNav.wellsIdsFromTags[i]);
      }

      getWells({
        variables: {
          wellIdArray: IdsArray
        },
      });

      if (stateNav.wellsIdsFromTags.length > 0)
        filter = ["match", ["get", "id"], IdsArray, true, false];
    }

    setStateNav((stateNav) => ({ ...stateNav, filterTags: filter }));
  }, [stateNav.wellsIdsFromTags]);

  useEffect(() => {
    if (
      dataWells &&
      dataWells.wells &&
      dataWells.wells.results &&
      dataWells.wells.results.length !== 0
    ) {
      setStateApp((stateApp) => ({
        ...stateApp,
        wellListFromTagsFilter: [...dataWells.wells.results],
      }));
      stateApp.toggleLayersActivity("User Tags", true);
    }
  }, [dataWells]);

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

      {/* //// tracked owners commented and replaced for the next <Grid> block, as well as some css inside FilterTrackedWells component */}
      {/* <Grid item sm={6} className={classes.gridItem}>
        <FilterTrackedWells />
      </Grid>
      {/* <Grid item sm={6} className={classes.gridItem}>
        <FilterTrackedOwners />
      </Grid> */}
      <Grid item sm={12} className={classes.gridItem}>
        <FilterTrackedWells />
      </Grid>
    </Grid>
  );
}
