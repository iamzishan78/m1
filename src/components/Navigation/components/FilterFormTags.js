import React, { useRef, useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavigationContext } from "../NavigationContext";
import FilterTags from "./FilterTags";
import FilterTrackedOwners from "./FilterTrackedOwners";
import FilterTrackedWells from "./FilterTrackedWells";
import Grid from "@material-ui/core/Grid";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AppContext } from "../../../AppContext";
import { ALLTAGGEDWELLSQUERY } from "../../../graphQL/useQueryAllTaggedWells";
// import { UPDATELAYERSETTINGS } from "../../../graphQL/useMutationUpdateLayerSettings";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function FilterFormProduction() {
  const isMounted = useRef(false);
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateApp, setStateApp] = useContext(AppContext);

  const [getAllTaggedWells, { loading, data: dataAllTaggedWells }] = useLazyQuery(ALLTAGGEDWELLSQUERY, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if(isMounted.current) {
      if(stateNav.selectedTags?.length > 0) {
        getAllTaggedWells({
          variables: {
            tagsArray: [...stateNav.selectedTags],
            userId: stateApp.user.mongoId,
          },
        })
      }
    } else {
      isMounted.current = true;
    }
  }, [stateNav.selectedTags]);

  useEffect(() => {
    if(dataAllTaggedWells?.allTaggedWells) {
      const IdsArray = [ ...new Set(dataAllTaggedWells?.allTaggedWells?.map(taggedWell => taggedWell.id)) ];

      let filter = null;

      if (IdsArray?.length > 0) {
        filter = ["match", ["get", "id"], IdsArray, true, false];
      }

      setStateNav((stateNav) => ({
        ...stateNav,
        filterTags: filter,
      }));
      setStateApp((stateApp) => ({
        ...stateApp,
        wellListFromTagsFilter: [...(dataAllTaggedWells?.allTaggedWells || [])],
      }));
      stateApp.toggleLayersActivity("User Tags", true);

      stateNav.filterTagsLoading(false);
    }
  }, [dataAllTaggedWells?.allTaggedWells])

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
