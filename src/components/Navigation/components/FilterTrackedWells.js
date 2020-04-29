import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";
import Switch from '@material-ui/core/Switch';
import { NavigationContext } from "../NavigationContext";
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { TRACKSBYUSERANDOBJECTTYPE } from "../../../graphQL/useQueryTracksByUserAndObjectType";
import { USERBYEMAIL } from "../../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed
import { AppContext } from "../../../AppContext";
import { isTemplateExpression } from "typescript";

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
  const [valueMinDisplay, setValueMinDisplay] = useState("");
  const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  const [noOwners , setNoOwners] = useState(false);
  const [owners , setOwners] = useState(false);
  const [tracks , setTracks] = useState(false);
  const [idArray , setIdArray] = useState(null);

  const [ownerCountWell, setOwnerCountWell] = useState(
    stateNav.ownerCountWell ? stateNav.ownerCountWell : []
  );
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

        console.log('track wells',dataWells)

        const idArray = dataWells.wells.results.map(
          (item) => item.api
        )
        const latArray = dataWells.wells.results.map(
          (item) => item.latitude
        )
        const longArray = dataWells.wells.results.map(
          (item) => item.longitude
        )

        console.log('track well id',idArray)
        console.log('track well lat',latArray)
        console.log('track well long',longArray)
        console.log('track well long',Math.min(...longArray))

        setIdArray(idArray);

        setRows(dataWells.wells.results);

        setStateApp((state) => ({
          ...state,
          wells: dataWells.wells.results,
        }));


      } else {
        setRows([]);
      }
      setLoading(false);
    }
  }, [dataWells]);





  // const handleListClick = (well) => {
  //   setStateApp((state) => ({ ...state, popupOpen: false }));
  //   setStateApp((state) => ({ ...state, selectedWell: well }));
  //   setStateApp((state) => ({ ...state, selectedWellId: well.id }));
  //   setStateApp((state) => ({ ...state, flyTo: well }));
  // };



  // const handleIdChange = value => {
  //   let filter;
  //   if(value && value.length) {
  //     filter = ['match', ['get', 'id'], value, true, false]
  //   }
  //   else {
  //     filter = null
  //   }
  //   setStateNav(stateNav => ({ ...stateNav, filterTrackedWells: filter}))
  //   };













  const toggleTracks = () => {
    setTracks(tracks => !tracks)
  }






  
  useEffect(() => {

    let filter;
  
    if(idArray && idArray.length) {
      filter = ['match', ['get', 'api'], idArray, true, false]
    }
    else {
      filter = null
    }

    setStateNav(stateNav => ({ ...stateNav, filterTrackedWells: filter}))




  },[tracks, setStateNav])



  useEffect(() => {
    let filter;
    if (owners) {
      filter = ["any",["==",[ "get", "hasOwner"], true]] 
    } else {
      filter = null;
    }
    setStateNav(stateNav => ({
      ...stateNav,
      filterHasOwnerCount: filter
    }));
  },[noOwners, owners, setStateNav])

  useEffect(() => {
    if (stateNav.filterNoOwnerCount && stateNav.filterNoOwnerCount.length > 1) {
      setNoOwners(true)
    }
  },[stateNav.filterNoOwnerCount])
  
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
