import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavigationContext } from "../NavigationContext";
import { AppContext } from "../../../AppContext";
import FilterStateName from "./FilterStateName";
import FilterCountyName from "./FilterCountyName";
import Grid from "@material-ui/core/Grid";
import FilterGrid from "./FilterGrid12345";
import FilterFromDrawing from "./FilterFromDrawing";
import FilterBasin from "./FilterBasin";
import FilterAOI from "./FilterAOI";
import FilterParcel from "./FilterParcel";
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLSMINMAXLATLONG } from "../../../graphQL/useQueryWellsMinMaxLatLong";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function FilterFromGeo() {
  const classes = useStyles();
  const [, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [getWellsMinMaxLatLong, { data }] = useLazyQuery(WELLSMINMAXLATLONG);

  useEffect(() => {
    //// Geo Filter Builder ////
    if (
      stateNav.stateName ||
      stateNav.countyName ||
      stateNav.GrId1 ||
      stateNav.GrId2 ||
      stateNav.GrId3 ||
      stateNav.GrId4 ||
      stateNav.GrId5
    ) {
      let filter = ["all"];

      if (stateNav.stateName)
        filter.push([
          "match",
          ["get", "state"],
          stateNav.stateName,
          true,
          false,
        ]);

      if (stateNav.countyName)
        filter.push([
          "match",
          ["get", "county"],
          stateNav.countyName,
          true,
          false,
        ]);

      if (stateNav.GrId1)
        filter.push(["match", ["get", "grid1"], stateNav.GrId1, true, false]);

      if (stateNav.GrId2)
        filter.push(["match", ["get", "grid2"], stateNav.GrId2, true, false]);

      if (stateNav.GrId3)
        filter.push(["match", ["get", "grid3"], stateNav.GrId3, true, false]);

      if (stateNav.GrId4)
        filter.push(["match", ["get", "grid4"], stateNav.GrId4, true, false]);

      if (stateNav.GrId5)
        filter.push(["match", ["get", "grid5"], stateNav.GrId5, true, false]);

      setStateNav((stateNav) => ({
        ...stateNav,
        filterGeography: filter,
      }));
    } else {
      setStateNav((stateNav) => ({
        ...stateNav,
        filterGeography: null,
      }));
    }
  }, [
    stateNav.stateName,
    stateNav.countyName,
    stateNav.GrId1,
    stateNav.GrId2,
    stateNav.GrId3,
    stateNav.GrId4,
    stateNav.GrId5,
  ]);

  useEffect(() => {
    //// Geo Filter Fit Bounds ////
    if (
      stateNav.stateName ||
      stateNav.countyName ||
      stateNav.GrId1 ||
      stateNav.GrId2 ||
      stateNav.GrId3 ||
      stateNav.GrId4 ||
      stateNav.GrId5
    ) {
      let whereFields = {};

      if (stateNav.stateName) whereFields.State = stateNav.stateName;

      if (stateNav.countyName) whereFields.County = stateNav.countyName;

      if (stateNav.GrId1) whereFields.GrId1 = stateNav.GrId1;

      if (stateNav.GrId2) whereFields.GrId2 = stateNav.GrId2;

      if (stateNav.GrId3) whereFields.GrId3 = stateNav.GrId3;

      if (stateNav.GrId4) whereFields.GrId4 = stateNav.GrId4;

      if (stateNav.GrId5) whereFields.GrId5 = stateNav.GrId5;

      ///////////Getting Geo Filters Bounds//////////
      getWellsMinMaxLatLong({
        variables: {
          whereFields,
        },
      });
    } else {
      setStateApp((stateApp) => ({
        ...stateApp,
        fitBounds: null,
      }));
    }
  }, [
    stateNav.stateName,
    stateNav.countyName,
    stateNav.GrId1,
    stateNav.GrId2,
    stateNav.GrId3,
    stateNav.GrId4,
    stateNav.GrId5,
  ]);

  useEffect(() => {
    if (data) {
      if (
        data.wellsMinMaxLatLong &&
        data.wellsMinMaxLatLong.length > 0 &&
        data.wellsMinMaxLatLong[0].maxLat &&
        data.wellsMinMaxLatLong[0].minLat &&
        data.wellsMinMaxLatLong[0].maxLong &&
        data.wellsMinMaxLatLong[0].minLong
      ) {
        ///////////Setting Geo Filters Bounds////////
        setStateApp((stateApp) => ({
          ...stateApp,
          fitBounds: data.wellsMinMaxLatLong[0],
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
      <Grid item sm={12}>
        <FilterFromDrawing />
      </Grid>
      <Grid item sm={12} className={classes.gridItem}>
        <FilterAOI />
      </Grid>
      <Grid item sm={12} className={classes.gridItem}>
        <FilterParcel />
      </Grid>
      <Grid item sm={12} className={classes.gridItem}>
        <FilterBasin />
      </Grid>
      <Grid item sm={12} className={classes.gridItem}>
        <FilterStateName style={{ margin: 0 }} />
      </Grid>
      <Grid item sm={12} className={classes.gridItem}>
        <FilterCountyName />
      </Grid>
      {stateNav.stateName === "TX" && (
        <Grid item sm={12} className={classes.gridItem}>
          <FilterGrid gridNumber={1} label="Survey" />
        </Grid>
      )}
      <Grid item sm={12} className={classes.gridItem}>
        <FilterGrid
          gridNumber={2}
          label={stateNav.stateName === "TX" ? "Block" : "Township"}
        />
      </Grid>
      <Grid item sm={12} className={classes.gridItem}>
        <FilterGrid
          gridNumber={3}
          label={stateNav.stateName === "TX" ? "Section" : "Range"}
        />
      </Grid>
      <Grid item sm={12} className={classes.gridItem}>
        <FilterGrid
          gridNumber={4}
          label={stateNav.stateName === "TX" ? "Abstract" : "Section"}
        />
      </Grid>
      {stateNav.stateName === "TX" && (
        <Grid item sm={12} className={classes.gridItem}>
          <FilterGrid gridNumber={5} label="Alternate Survey" />
        </Grid>
      )}
    </Grid>
  );
}
