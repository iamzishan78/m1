import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from '@material-ui/core/Switch';
import { NavigationContext } from "../NavigationContext";
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { TRACKSBYUSERANDOBJECTTYPE } from "../../../graphQL/useQueryTracksByUserAndObjectType";
import { USERBYEMAIL } from "../../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed
import { AppContext } from "../../../AppContext";
import { MapControlsContext } from "../../MapControls/MapControlsContext";
import { MapContext } from "../../Map/MapContext";


const useStyles = makeStyles({
  input: {
    margin: 20,
    maxWidth: 168,
    minWidth: 167
  },
  inputLabel: {
    color: "black",
    minWidth: 249,
    maxWidth: 250,
    marginLeft: 20
  },
  noOwners: {
    padding: "6px 0px",
    display: "flex",
  },
  noOwnersToggle:{
    marginLeft: 20,
  }
});

export default function FilterOwnerCount() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  // const [valueMinDisplay, setValueMinDisplay] = useState("");
  // const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  // const [noOwners , setNoOwners] = useState(false);
  // const [owners , setOwners] = useState(false);


  const [tracks , setTracks] = useState(false);
  const [idArray , setIdArray] = useState(null);
  const [firstWell , setFirstWell] = useState(null);

  // const [ownerCountWell, setOwnerCountWell] = useState(
  //   stateNav.ownerCountWell ? stateNav.ownerCountWell : []
  // );

  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );

  const [stateMap, setStateMap] = useContext(MapContext);


  const [stateApp, setStateApp] = useContext(AppContext);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = useState(true);


  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  const [tracksByUserAndObjectType, { data: dataTracks }] = useLazyQuery(
    TRACKSBYUSERANDOBJECTTYPE
  );

  //////begin////////temporary  while signed user fixed

  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [user, setUser] = useState({ _id: "" });

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
  }, [dataUser]);

  /////end/////////temporary while signed user fixed

  useEffect(() => {
    //////stateApp.user._id////////temporary while signed user fixed
    if (user._id !== "") {
      setLoading(true);

      tracksByUserAndObjectType({
        variables: {
          userId: user._id, //////stateApp.user._id////////temporary while signed user fixed
          objectType: "well",
        },
      });
    }
  }, [user]); //////stateApp.user._id////////temporary while signed user fixed

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

        const idArray = dataWells.wells.results.map(
          (item) => item.api
        )

        setIdArray(idArray);

      } else {
        setRows([]);
      }
      setLoading(false);
    }
  }, [dataWells]);



  const toggleTracks = () => {
    setTracks(tracks => !tracks)
  }


  
  useEffect(() => {

    if(idArray){
    let filter;
  
    if(idArray && idArray.length) {
      filter = ['match', ['get', 'api'], idArray, true, false]
    }
    else {
      filter = null
    }

    setStateNav(stateNav => ({ ...stateNav, filterTrackedWells: filter}))
    setStateApp({
          ...stateApp,
          trackedWellArray: dataWells,
          trackFilterOn: true,
        });

  }
  },[tracks])



  
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
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </div>
    </div>
  );
}
