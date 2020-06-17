import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { NavigationContext } from "../NavigationContext";
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { TRACKSBYUSERANDOBJECTTYPE } from "../../../graphQL/useQueryTracksByUserAndObjectType";
import { AppContext } from "../../../AppContext";
import { MapControlsContext } from "../../MapControls/MapControlsContext";
import SimpleUserTable from "../../Providers/TrackWellsProvider";

const useStyles = makeStyles({
  input: {
    margin: 20,
    maxWidth: 168,
    minWidth: 167,
  },
  inputLabel: {
    color: "black",
    minWidth: 249,
    maxWidth: 250,
    marginLeft: 20,
  },
  noOwners: {
    padding: "6px 0px",
    display: "flex",
  },
  noOwnersToggle: {
    marginLeft: 20,
  },
});

const data2 = SimpleUserTable;

export default function FilterOwnerCount() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [tracks, setTracks] = useState(false);
  const [idArray, setIdArray] = useState(null);

  // const [firstWell , setFirstWell] = useState(null);
  // const [stateMapControls, setStateMapControls] = useContext(
  //   MapControlsContext
  // );

  

  const [stateApp, setStateApp] = useContext(AppContext);

  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  const [tracksByUserAndObjectType, { data: dataTracks }] = useLazyQuery(
    TRACKSBYUSERANDOBJECTTYPE
  );

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      setLoading(true);

      tracksByUserAndObjectType({
        variables: {
          userId: stateApp.user.mongoId,
          objectType: "well",
        },
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (dataTracks && dataTracks.tracksByUserAndObjectType) {
      if (dataTracks.tracksByUserAndObjectType.length !== 0) {
        const tracksIdArray = dataTracks.tracksByUserAndObjectType.map(
          (track) => track.trackOn
        );

        getWells({
          variables: {
            wellIdArray: tracksIdArray,
            authToken: stateApp.user.authToken,
          },
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataTracks]);

  useEffect(() => {
    if (dataWells) {
      if (
        dataWells.wells &&
        dataWells.wells.results &&
        dataWells.wells.results.length > 0
      ) {
        const idArray = dataWells.wells.results.map((item) => item.api);

        setIdArray(idArray);
      } else {
        setRows([]);
      }
      setLoading(false);
    }
  }, [dataWells]);

  const toggleTracks = () => {
    setTracks((tracks) => !tracks);
  };

  useEffect(() => {
    if (idArray) {
      let filter;

      if (idArray && idArray.length) {
        filter = ["match", ["get", "api"], idArray, true, false];
      } else {
        filter = null;
      }

      setStateNav((stateNav) => ({ ...stateNav, filterTrackedWells: filter }));
      setStateApp({
        ...stateApp,
        trackedWellArray: dataWells,
        trackFilterOn: true,
      });
    }
  }, [tracks]);

  return (
    <div>
      <div className={classes.noOwners}>
        <Typography
          className={classes.inputLabel}
          htmlFor="select-multiple-chip1"
        >
          Tracked Wells
        </Typography>
        <Switch
          className={classes.noOwnersToggle}
          checked={tracks}
          onChange={toggleTracks}
          color="primary"
          name="checked"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      </div>
    </div>
  );
}
