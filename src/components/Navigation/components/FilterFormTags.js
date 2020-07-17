import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavigationContext } from "../NavigationContext";
import FilterTags from "./FilterTags";
import FilterTrackedOwners from "./FilterTrackedOwners";
import FilterTrackedWells from "./FilterTrackedWells";
import Grid from "@material-ui/core/Grid";
import { useLazyQuery } from "@apollo/react-hooks";
import { AppContext } from "../../../AppContext";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";

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

  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);

  useEffect(() => {
    let filter;

    if (stateNav.wellsIdsFromTags && stateNav.wellsIdsFromTags.length > 0) {
      let IdsArray = [];
      for (let i = 0; i < stateNav.wellsIdsFromTags.length; i++) {
        if (IdsArray.indexOf(stateNav.wellsIdsFromTags[i]) === -1)
          IdsArray.push(stateNav.wellsIdsFromTags[i]);
      }

      filter = ["match", ["get", "id"], IdsArray, true, false];

      getWells({
        variables: {
          wellIdArray: IdsArray,
          authToken: stateApp.user.authToken,
        },
      });
    } else {
      filter = null;
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
      console.log("wells data from tags filter", dataWells.wells.results);

      setStateApp((stateApp) => ({
        ...stateApp,
        wellListFromTagsFilter: dataWells.wells.results,
      }));
      stateApp.activateUserDefinedLayers(5);
      // stateApp.deactivateWellLayer();
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
      <Grid item sm={6} className={classes.gridItem}>
        <FilterTrackedWells />
      </Grid>
      <Grid item sm={6} className={classes.gridItem}>
        <FilterTrackedOwners />
      </Grid>
    </Grid>
  );
}
