import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from '@material-ui/core/Switch';
// import { NavigationContext } from "../NavigationContext";
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLSQUERY } from "../../graphQL/useQueryWells";
import { TRACKSBYUSERANDOBJECTTYPE } from "../../graphQL/useQueryTracksByUserAndObjectType";
import { USERBYEMAIL } from "../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed
import { AppContext } from "../../AppContext";

// import { MapControlsContext } from "../../MapControls/MapControlsContext";
// import { MapContext } from "../../Map/MapContext";






const SimpleUserTable = (props) => {

//   const [stateNav, setStateNav] = useContext(NavigationContext);
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

//   const [stateMapControls, setStateMapControls] = useContext(
//     MapControlsContext
//   );

//   const [stateMap, setStateMap] = useContext(MapContext);


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





//   export default mapStyles[0];

  return (dataWells)

}

console.log('SIMPLE USER TABLE', SimpleUserTable)

export default SimpleUserTable