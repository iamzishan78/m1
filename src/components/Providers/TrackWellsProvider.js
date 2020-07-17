import React, { useState, useContext, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
// import { NavigationContext } from "../NavigationContext";
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLSQUERY } from "../../graphQL/useQueryWells";
import { TRACKSBYUSERANDOBJECTTYPE } from "../../graphQL/useQueryTracksByUserAndObjectType";
import { AppContext } from "../../AppContext";

// import { MapControlsContext } from "../../MapControls/MapControlsContext";

const SimpleUserTable = (props) => {
  //   const [stateNav, setStateNav] = useContext(NavigationContext);
  // const [valueMinDisplay, setValueMinDisplay] = useState("");
  // const [valueMaxDisplay, setValueMaxDisplay] = useState("");
  // const [noOwners , setNoOwners] = useState(false);
  // const [owners , setOwners] = useState(false);

  const [tracks, setTracks] = useState(false);
  const [idArray, setIdArray] = useState(null);
  const [firstWell, setFirstWell] = useState(null);

  // const [ownerCountWell, setOwnerCountWell] = useState(
  //   stateNav.ownerCountWell ? stateNav.ownerCountWell : []
  // );

  //   const [stateMapControls, setStateMapControls] = useContext(
  //     MapControlsContext
  //   );

  //   

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

  //   export default mapStyles[0];

  return dataWells;
};

console.log("SIMPLE USER TABLE", SimpleUserTable);

export default SimpleUserTable;
